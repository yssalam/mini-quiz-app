import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  TrendingUp,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Target,
  Home,
  History
} from 'lucide-react';
import { quizAPI } from "../../services/quizApi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    if (!result && sessionId) {
      console.log("🔍 [Result] Loading result from API for session:", sessionId);
      loadResult(sessionId);
    } else if (!result && !sessionId) {
      console.log("⚠️ [Result] No result data and no sessionId, redirecting...");
      navigate("/dashboard");
    }
  }, [sessionId, result, navigate]);

  const loadResult = async (id) => {
    console.log("📦 [Result] Fetching result for session:", id);
    setLoading(true);

    try {
      const res = await quizAPI.getResult(id);
      console.log("✅ [Result] Result response:", res);

      if (res.data?.success) {
        console.log("📊 [Result] Result data:", res.data.data);
        setResult(res.data.data);
      } else {
        console.log("❌ [Result] Failed to load result");
        alert("Failed to load result");
        navigate("/history");
      }
    } catch (err) {
      console.error("❌ [Result] Error loading result:", err);
      alert("Result not found");
      navigate("/history");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'from-green-600 to-emerald-600';
    if (percentage >= 60) return 'from-blue-600 to-cyan-600';
    return 'from-orange-600 to-red-600';
  };

  const getScoreTextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Memuat hasil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!result) return null;

  console.log("🎨 [Result] Rendering result:", result);

  const percentage = result.score_percentage || 0;
  const isPassed = percentage >= 60;
  const correctAnswers = result.score || 0;
  const totalQuestions = result.total_questions || 0;
  const wrongAnswers = totalQuestions - correctAnswers;

  // Sample questions data - replace with actual API data if available
  const questions = result.questions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 max-w-3xl">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Hasil Quiz
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{result.subtest_name}</p>
        </div>

        {/* Score Summary Card */}
        <div className="mb-6 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-blue-100 mx-1 sm:mx-0">
          <div className={`h-1.5 bg-gradient-to-r ${getScoreColor(percentage)}`}></div>
          
          <div className="p-5 sm:p-7">
            {/* Main Score Display */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
                <div className="text-center">
                  <div className={`text-3xl sm:text-5xl font-bold ${getScoreTextColor(percentage)}`}>
                    {percentage.toFixed(0)}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Skor</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                {isPassed ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-xl sm:text-2xl font-bold text-green-700">
                      Selamat! Anda Lulus
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-orange-600" />
                    <span className="text-xl sm:text-2xl font-bold text-orange-700">
                      Belum Lulus
                    </span>
                  </>
                )}
              </div>
              
              <p className="text-sm sm:text-base text-gray-600">
                Passing score: 60%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isPassed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">Benar</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-700">
                  {correctAnswers}
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3 sm:p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-gray-600">Salah</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-red-700">
                  {wrongAnswers}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Total Soal</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-700">
                  {totalQuestions}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Selesai: {new Date(result.completed_at).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Answers Section - Only show if questions data is available */}
        {questions && questions.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 mx-1 sm:mx-0 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Review Jawaban
            </h2>

            <div className="space-y-3">
              {questions.map((q, index) => (
                <div 
                  key={q.id || index}
                  className={`rounded-lg sm:rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                    q.is_correct 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(q.id || index)}
                    className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {q.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">
                          Soal #{index + 1}
                        </span>
                        {expandedQuestion === (q.id || index) ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {q.question}
                      </p>
                    </div>
                  </button>

                  {/* Expanded Answer Details */}
                  {expandedQuestion === (q.id || index) && (
                    <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                      <div className="mt-4 space-y-3">
                        {/* Options */}
                        {q.options && q.options.length > 0 && (
                          <div className="space-y-2">
                            {q.options.map((option, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm ${
                                  option === q.correct_answer
                                    ? 'bg-green-100 border-2 border-green-300 font-medium'
                                    : option === q.user_answer && !q.is_correct
                                    ? 'bg-red-100 border-2 border-red-300'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {option === q.correct_answer && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                  {option === q.user_answer && !q.is_correct && (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                  <span>{option}</span>
                                  {option === q.correct_answer && (
                                    <span className="ml-auto text-xs text-green-600">Jawaban Benar</span>
                                  )}
                                  {option === q.user_answer && !q.is_correct && (
                                    <span className="ml-auto text-xs text-red-600">Jawaban Anda</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-blue-700 mb-1">
                              Penjelasan:
                            </div>
                            <p className="text-sm text-gray-700">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mx-1 sm:mx-0">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <Home className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
          <button 
            onClick={() => navigate("/quiz/history")}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 text-sm sm:text-base"
          >
            <History className="w-4 h-4" />
            Lihat Riwayat
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Result;