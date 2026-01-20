import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Circle,
    Send,
    AlertCircle
} from 'lucide-react';
import { quizAPI } from "../../services/quizApi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Quiz = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        loadActiveQuiz();
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!session) return;

        const timer = setInterval(() => {
            const now = new Date();
            const expires = new Date(session.expires_at);
            const diff = Math.floor((expires - now) / 1000);

            if (diff <= 0) {
                clearInterval(timer);
                handleSubmit();
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    const loadActiveQuiz = async () => {
        try {
            const res = await quizAPI.getActiveQuiz();

            if (res.data?.success && res.data?.data) {
                const sessionData = res.data.data;
                setSession(sessionData);
                setAnswers(sessionData.answers || {});

                const now = new Date();
                const expires = new Date(sessionData.expires_at);
                const diff = Math.floor((expires - now) / 1000);
                setTimeLeft(diff);
            } else {
                alert("No active quiz found");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Error loading quiz:", err);
            alert("Failed to load quiz");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionNumber, option) => {
        setAnswers({
            ...answers,
            [questionNumber]: option,
        });
    };

    const handleSubmit = async () => {
        if (!window.confirm("Apakah Anda yakin ingin submit quiz?")) {
            return;
        }

        try {
            const res = await quizAPI.submitQuiz(answers);

            if (res.data?.success) {
                navigate("/quiz/result", { state: { result: res.data.data } });
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("Gagal submit quiz");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Memuat quiz...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!session || !session.questions || session.questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-xl text-red-600">Tidak ada soal tersedia</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const currentQuestion = session.questions[currentIndex];
    const totalQuestions = session.questions.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
            <Navbar />

            <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-5xl">

                {/* Header Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 mb-4 sm:mb-6 mx-1 sm:mx-0 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>

                    <div className="p-4 sm:p-6">
                        {/* Desktop Header Layout */}
                        <div className="hidden sm:flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                    {session.subtest_name}
                                </h2>
                                <p className="text-gray-600">
                                    Pertanyaan {currentIndex + 1} dari {totalQuestions}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">Sisa Waktu</p>
                                <div className={`text-3xl font-bold ${timeLeft < 300 ? "text-red-600" : timeLeft < 600 ? "text-orange-600" : "text-green-600"
                                    }`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Header Layout */}
                        <div className="sm:hidden mb-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                                        {session.subtest_name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Soal {currentIndex + 1}/{totalQuestions}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 px-3 py-2 rounded-lg border border-blue-200">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className={`text-lg font-bold ${timeLeft < 300 ? "text-red-600" : timeLeft < 600 ? "text-orange-600" : "text-blue-600"
                                        }`}>
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs font-medium text-gray-700">
                                    {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 mb-4 sm:mb-6 mx-1 sm:mx-0">
                    <div className="p-5 sm:p-8">
                        <div className="flex items-start gap-3 mb-6">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-lg flex items-center justify-center font-bold text-sm sm:text-base">
                                {currentIndex + 1}
                            </div>
                            <h3 className="text-base sm:text-xl font-semibold text-gray-800 flex-1">
                                {currentQuestion.question_text}
                            </h3>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const optionLetter = String.fromCharCode(65 + idx);
                                const isSelected = answers[currentQuestion.question_number] === optionLetter;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(currentQuestion.question_number, optionLetter)}
                                        className={`w-full text-left p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${isSelected
                                                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md"
                                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                                                }`}>
                                                {isSelected ? (
                                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                ) : (
                                                    <Circle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                                                )}
                                            </div>
                                            <span className={`font-semibold text-sm sm:text-base ${isSelected ? "text-blue-700" : "text-gray-700"
                                                }`}>
                                                {optionLetter}.
                                            </span>
                                            <span className={`flex-1 text-sm sm:text-base ${isSelected ? "text-gray-800 font-medium" : "text-gray-700"
                                                }`}>
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Question Navigator - Desktop */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-blue-100 mb-6">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-700">Navigasi Soal</h4>
                            <span className="text-sm text-gray-600">
                                Terjawab: <span className="font-bold text-blue-600">{answeredCount}</span> / {totalQuestions}
                            </span>
                        </div>
                        <div className="grid grid-cols-10 gap-2">
                            {session.questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`aspect-square rounded-lg font-medium text-sm transition-all ${idx === currentIndex
                                            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md scale-110"
                                            : answers[q.question_number]
                                                ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question Navigator - Mobile (Compact) */}
                <div className="lg:hidden bg-white rounded-xl shadow-lg border border-blue-100 mb-4 mx-1 overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-gray-700">Navigasi</h4>
                            <span className="text-xs text-gray-600">
                                <span className="font-bold text-blue-600">{answeredCount}</span>/{totalQuestions}
                            </span>
                        </div>
                        <div className="grid grid-cols-8 gap-1.5">
                            {session.questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`aspect-square rounded-md font-medium text-xs transition-all ${idx === currentIndex
                                            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md"
                                            : answers[q.question_number]
                                                ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center gap-3 mx-1 sm:mx-0">
                    <button
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${currentIndex === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-sm"
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                        >
                            <Send className="w-4 h-4" />
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                        >
                            <span className="hidden sm:inline">Selanjutnya</span>
                            <span className="sm:hidden">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Quiz;