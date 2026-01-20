import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { quizAPI } from "../../services/quizApi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionId } = useParams(); 

    const [result, setResult] = useState(location.state?.result || null);
    const [loading, setLoading] = useState(!location.state?.result);

    useEffect(() => {
        // ✅ Jika tidak ada result dari state, fetch dari API
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
                navigate("/quiz/history");
            }
        } catch (err) {
            console.error("❌ [Result] Error loading result:", err);
            alert("Result not found");
            navigate("/quiz/history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Loading result...</p>
            </div>
        );
    }

    if (!result) return null;

    console.log("🎨 [Result] Rendering result:", result);

    const percentage = result.score_percentage;
    const isPassed = percentage >= 60;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="w-6xl flex-1 mx-auto px-4 py-8 max-">
                <div className="max-w-2xl mx-auto">
                    {/* Result Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isPassed ? "bg-green-100" : "bg-red-100"
                            }`}>
                            <span className="text-5xl">
                                {isPassed ? "✓" : "✗"}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold mb-2">
                            {isPassed ? "Selamat! Anda Lulus" : "Belum Lulus"}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {result.subtest_name}
                        </p>

                        {/* Score Display */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-gray-600 text-sm">Skor</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {result.score} / {result.total_questions}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Persentase</p>
                                    <p className={`text-3xl font-bold ${isPassed ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {percentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className={`h-4 rounded-full transition-all ${isPassed ? "bg-green-500" : "bg-red-500"
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Completion Time */}
                        <p className="text-gray-600 mb-8">
                            Selesai pada: {new Date(result.completed_at).toLocaleString("id-ID")}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate("/quiz/history")}
                                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700"
                            >
                                Lihat Riwayat
                            </button>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Kembali ke Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Result;