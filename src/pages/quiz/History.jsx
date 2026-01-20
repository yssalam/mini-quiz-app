import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizAPI } from "../../services/quizApi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Calendar, Trophy, Target, TrendingUp, Eye, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 0,
        total: 0,
    });

    useEffect(() => {
        loadHistory();
    }, [pagination.offset]);

    const loadHistory = async () => {
        console.log("📜 [History] Loading quiz history...");
        setLoading(true);
        setError("");

        try {
            const res = await quizAPI.getHistory(pagination.limit, pagination.offset);
            console.log("📦 [History] Raw response:", res);

            if (res.data?.success) {
                console.log("✅ [History] History data:", res.data.data);
                console.log("📊 [History] Total records:", res.data.total);

                setHistory(res.data.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.total,
                }));
            } else {
                console.log("⚠️ [History] Response not successful");
                setError("Failed to load history");
            }
        } catch (err) {
            console.error("❌ [History] Error loading history:", err);
            setError("Failed to load quiz history");
        } finally {
            setLoading(false);
            console.log("🏁 [History] Loading complete");
        }
    };

    const viewDetail = (sessionId) => {
        console.log("👁️ [History] Viewing detail for session:", sessionId);
        navigate(`/result/${sessionId}`);
    };

    const nextPage = () => {
        console.log("➡️ [History] Going to next page");
        setPagination(prev => ({
            ...prev,
            offset: prev.offset + prev.limit,
        }));
    };

    const prevPage = () => {
        console.log("⬅️ [History] Going to previous page");
        setPagination(prev => ({
            ...prev,
            offset: Math.max(0, prev.offset - prev.limit),
        }));
    };

    const getStatusBadge = (percentage) => {
        if (percentage >= 80) {
            return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Sangat Baik</span>;
        } else if (percentage >= 60) {
            return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Baik</span>;
        } else {
            return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Tidak Lulus</span>;
        }
    };

    const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading history...</p>
                </main>
                
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            <Navbar />
            <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 max-w-6xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                            Riwayat Quiz
                        </h1>
                        <p className="text-sm text-gray-600">Lihat semua hasil quiz Anda</p>
                    </div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 mx-1 sm:mx-0">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {history.length === 0 ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center mx-1 sm:mx-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Riwayat</h3>
                        <p className="text-gray-600 mb-6">Mulai quiz pertama Anda sekarang!</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Mulai Quiz Baru
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Quiz</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Skor</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Persentase</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {history.map((item, index) => (
                                        <tr key={item.session_id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {new Date(item.completed_at).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">{item.subtest_name}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-gray-800">
                                                    {item.score} / {item.total_questions}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-bold ${getScoreColor(item.score_percentage)}`}>
                                                    {item.score_percentage.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.score_percentage)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => viewDetail(item.session_id)}
                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-3 mx-1">
                            {history.map((item) => (
                                <div
                                    key={item.session_id}
                                    className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden"
                                >
                                    {/* Color accent bar */}
                                    <div className={`h-1 bg-gradient-to-r ${item.score_percentage >= 80
                                            ? 'from-green-600 to-emerald-600'
                                            : item.score_percentage >= 60
                                                ? 'from-blue-600 to-cyan-600'
                                                : 'from-orange-600 to-red-600'
                                        }`}></div>

                                    <div className="p-4">
                                        {/* Quiz Name & Status */}
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <h3 className="font-bold text-gray-800 flex-1">
                                                {item.subtest_name}
                                            </h3>
                                            {getStatusBadge(item.score_percentage)}
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {new Date(item.completed_at).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Target className="w-3.5 h-3.5 text-blue-600" />
                                                    <span className="text-xs text-gray-600">Skor</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {item.score}/{item.total_questions}
                                                </p>
                                            </div>

                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                                                    <span className="text-xs text-gray-600">Persentase</span>
                                                </div>
                                                <p className={`text-lg font-bold ${getScoreColor(item.score_percentage)}`}>
                                                    {item.score_percentage.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* View Detail Button */}
                                        <button
                                            onClick={() => viewDetail(item.session_id)}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 mx-1 sm:mx-0">
                            <p className="text-sm text-gray-600 text-center sm:text-left">
                                Menampilkan {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} dari {pagination.total} hasil
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevPage}
                                    disabled={pagination.offset === 0}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${pagination.offset === 0
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Sebelumnya</span>
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={pagination.offset + pagination.limit >= pagination.total}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${pagination.offset + pagination.limit >= pagination.total
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <span className="hidden sm:inline">Selanjutnya</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        <Footer />
        </div>
    );
};

export default History;