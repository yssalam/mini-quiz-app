import { useEffect, useState } from "react";
import { quizAPI } from "../../services/quizApi";
import { Timer, Brain, Play } from "lucide-react";

export default function QuizList({ onStart, onResume }) {
    const [subtests, setSubtests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        quizAPI
            .getSubtests()
            .then((res) => {
                console.log("SUBTEST RESPONSE:", res);
                // ✅ Akses res.data.data karena struktur nested
                if (res.data.success) {
                    setSubtests(res.data.data);
                }
            })
            .catch(() => setError("Gagal load quiz"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading quiz...</p>;
    if (error) return <p>{error}</p>;

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'mudah': return 'text-green-600 bg-green-50';
            case 'sedang': return 'text-blue-600 bg-blue-50';
            case 'sulit': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 mx-1 sm:mx-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-5">Pilih Quiz</h3>

            {/* Quiz Cards */}
            <div className="space-y-3 sm:space-y-4">
                {subtests.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="group bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        {/* Quiz Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1 truncate">
                                    {quiz.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                    {quiz.description}
                                </p>
                            </div>
                        </div>

                        {/* Quiz Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                            <div className="flex items-center gap-1.5 text-gray-700">
                                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                <span className="text-xs sm:text-sm font-medium">
                                    {quiz.duration_minutes} menit
                                </span>
                            </div>

                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>

                            <div className="flex items-center gap-1.5 text-gray-700">
                                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />
                                <span className="text-xs sm:text-sm font-medium">
                                    {quiz.total_questions} soal
                                </span>
                            </div>

                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>

                            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                {quiz.difficulty}
                            </span>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={() => onStart(quiz.id)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base group-hover:scale-[1.02]"
                        >
                            <Play className="w-4 h-4" />
                            Mulai Quiz
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
}
