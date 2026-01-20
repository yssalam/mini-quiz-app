import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from "react-router-dom";
import QuizList from "../../components/quiz/QuizList";
import { quizAPI } from "../../services/quizApi";
import { useState, useEffect } from "react";
import { Clock, AlertCircle, Play, RotateCcw, X } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showResume, setShowResume] = useState(false);
    const [pendingSubtest, setPendingSubtest] = useState(null);
    const [activeSession, setActiveSession] = useState(null);


    //  Check active session saat component mount
    useEffect(() => {
        checkActiveSession();
    }, []);

    const checkActiveSession = async () => {
        try {
            const res = await quizAPI.getActiveQuiz();
            console.log("Check active session response:", res);

            //  Sesuaikan dengan struktur response mock API
            if (res.data?.success && res.data?.data) {
                setActiveSession(res.data.data);
                setShowResume(true);
            } else {
                setShowResume(false);
                setActiveSession(null);
            }
        } catch (err) {
            console.error("Error checking active session:", err);
            setShowResume(false);
            setActiveSession(null);
        }
    };

    const startQuiz = async (subtestId) => {
        try {
            const res = await quizAPI.startQuiz(subtestId);
            console.log("Start quiz response:", res);

            // ✅ Pastikan session tersimpan
            if (res.data?.success) {
                navigate("/quiz");
            }
        } catch (err) {
            console.error("Start quiz error:", err);

            if (err.response?.status === 409) {
                // ✅ Ada quiz aktif, simpan subtest yang mau dimulai
                setPendingSubtest(subtestId);
                // ✅ Refresh data active session
                await checkActiveSession();
            } else {
                alert("Gagal memulai quiz");
            }
        }
    };

    const resumeQuiz = () => {
        // ✅ Clear pending subtest karena user pilih resume
        setPendingSubtest(null);
        setShowResume(false);
        navigate("/quiz");
    };

    const cancelAndStart = async () => {
        if (!pendingSubtest) {
            alert("Tidak ada quiz yang akan dimulai");
            return;
        }

        try {
            // ✅ Hapus session aktif
            localStorage.removeItem("active_quiz_session");

            // ✅ Reset state
            setShowResume(false);
            setActiveSession(null);

            // ✅ Langsung start quiz baru tanpa delay
            const res = await quizAPI.startQuiz(pendingSubtest);

            if (res.data?.success) {
                setPendingSubtest(null);
                navigate("/quiz");
            }
        } catch (err) {
            console.error("Error starting new quiz:", err);
            alert("Gagal memulai quiz baru: " + (err.message || "Unknown error"));

            // ✅ Refresh untuk cek apakah session sudah bersih
            await checkActiveSession();
        }
    };

    const cancelQuiz = async () => {
        if (!window.confirm("Yakin ingin membatalkan quiz yang sedang berjalan?")) {
            return;
        }

        try {
            // ✅ Hapus session
            localStorage.removeItem("active_quiz_session");

            // ✅ Reset state
            setShowResume(false);
            setActiveSession(null);
            setPendingSubtest(null);

            alert("Quiz berhasil dibatalkan");
        } catch (err) {
            console.error("Error canceling quiz:", err);
            alert("Gagal membatalkan quiz");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            <Navbar />
            <main className="mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-3xl">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        Selamat Datang
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">Kelola dan lanjutkan quiz Anda</p>
                </div>

                {/* ✅ Tampilkan modal resume jika ada active session */}
                {showResume && activeSession && (
                    <div className="mb-6 sm:mb-8 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-blue-100 mx-1 sm:mx-0">
                        {/* Color accent bar */}
                        <div className="h-1 sm:h-1.5 bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-400"></div>

                        <div className="p-4 sm:p-6">
                            {/* Icon & Title */}
                            <div className="flex items-start gap-3 sm:gap-4 mb-4">
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                                        Quiz Aktif Ditemukan
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Kamu masih memiliki quiz <strong>{activeSession.subtest_name}</strong> yang belum diselesaikan
                                    </p>
                                </div>
                            </div>

                            {/* Quiz Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Subtest</p>
                                        <p className="font-semibold text-sm sm:text-base text-gray-800 truncate pr-2">{activeSession.subtest_name}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm self-start sm:self-auto flex-shrink-0">
                                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                                            {Math.floor((new Date(activeSession.expires_at) - new Date()) / 60000)} menit tersisa
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={resumeQuiz}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    <Play className="w-4 h-4" />
                                    Lanjutkan Quiz
                                </button>

                                <button
                                    onClick={cancelAndStart}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span className="hidden xs:inline">Mulai Quiz Baru</span>
                                    <span className="xs:hidden">Quiz Baru</span>
                                </button>

                                <button
                                    onClick={cancelQuiz}
                                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 text-sm sm:text-base"
                                >
                                    <X className="w-4 h-4" />
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ✅ Disable QuizList jika ada active session */}
                <div className={`transition-all duration-300 ${showResume ? 'opacity-40 pointer-events-none' : ''}`}>
                    <QuizList onStart={startQuiz} />
                </div>

                {showResume && (
                    <div className="mt-4 sm:mt-6 text-center px-4">
                        <p className="text-gray-500 text-xs sm:text-sm">
                            Selesaikan atau batalkan quiz yang sedang berjalan untuk memulai quiz baru
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>



    );
};

export default Dashboard;