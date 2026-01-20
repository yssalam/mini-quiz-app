import { MOCK_MODE, http } from "./api";

/**
 * =========================
 * MOCK DATABASE
 * =========================
 */
let mockSubtests = [
    {
        id: "math-101",
        name: "Mathematics",
        description: "Basic mathematics quiz",
        question_count: 2,
        duration_minutes: 60,
        difficulty: "mudah",
    },
];

let mockQuestions = {
    "math-101": [
        {
            question_number: "1",
            question_text: "What is 1 + 1?",
            options: ["1", "2", "3", "4"],
            correct: "B",
        },
        {
            question_number: "2",
            question_text: "What is 2 + 2?",
            options: ["2", "3", "4", "5"],
            correct: "C",
        },
    ],
};

let activeSession = null;

// ✅ TAMBAH: Mock database untuk menyimpan history
let mockHistory = [];

/**
 * =========================
 * MOCK QUIZ API
 * =========================
 */
const mockQuizAPI = {
    getSubtests: () => {
        console.log("📚 [API] Getting subtests...");
        const response = { data: { success: true, data: mockSubtests } };
        console.log("✅ [API] Subtests response:", response);
        return Promise.resolve(response);
    },

    startQuiz: (subtestId) => {
        console.log("🚀 [API] Starting quiz for subtest:", subtestId);

        return new Promise((resolve, reject) => {
            // Sync activeSession dengan localStorage
            const stored = localStorage.getItem("active_quiz_session");
            if (stored) {
                activeSession = JSON.parse(stored);
                console.log("⚠️ [API] Active session found in localStorage:", activeSession);
            }

            if (activeSession) {
                console.log("❌ [API] Cannot start - active session exists");
                reject({
                    response: {
                        status: 409,
                        data: { error: "Active quiz exists" },
                    },
                });
                return;
            }

            const session = {
                session_id: "session-" + Date.now(),
                subtest_id: subtestId,
                subtest_name: mockSubtests.find(s => s.id === subtestId)?.name || "Quiz",
                questions: mockQuestions[subtestId] || [],
                expires_at: new Date(Date.now() + 3600000).toISOString(),
                answers: {},
            };

            activeSession = session;
            localStorage.setItem("active_quiz_session", JSON.stringify(session));

            console.log("✅ [API] Quiz started successfully:", session);
            resolve({ data: { success: true, data: session } });
        });
    },

    getActiveQuiz: () => {
        console.log("🔍 [API] Checking for active quiz...");

        const stored = localStorage.getItem("active_quiz_session");
        if (!stored) {
            activeSession = null;
            console.log("ℹ️ [API] No active session found");
            return Promise.resolve({ data: { success: true, data: null } });
        }

        activeSession = JSON.parse(stored);
        console.log("✅ [API] Active session found:", activeSession);

        // Check jika sudah expired
        if (new Date(activeSession.expires_at) < new Date()) {
            console.log("⚠️ [API] Session expired, removing...");
            localStorage.removeItem("active_quiz_session");
            activeSession = null;
            return Promise.resolve({ data: { success: true, data: null } });
        }

        return Promise.resolve({ data: { success: true, data: activeSession } });
    },

    cancelQuiz: () => {
        console.log("🗑️ [API] Canceling active quiz...");
        localStorage.removeItem("active_quiz_session");
        activeSession = null;
        console.log("✅ [API] Quiz canceled successfully");
        return Promise.resolve({ data: { success: true } });
    },

    submitQuiz: (answers) => {
        console.log("📝 [API] Submitting quiz with answers:", answers);

        return new Promise((resolve, reject) => {
            if (!activeSession) {
                console.log("❌ [API] No active session to submit");
                reject({
                    response: { status: 404, data: { error: "No active session" } },
                });
                return;
            }

            if (new Date(activeSession.expires_at) < new Date()) {
                console.log("❌ [API] Session expired");
                reject({
                    response: { status: 400, data: { error: "Session expired" } },
                });
                return;
            }

            let correct = 0;

            activeSession.questions.forEach((q) => {
                const userAnswer = answers?.[q.question_number];
                console.log(`Question ${q.question_number}: User answered ${userAnswer}, Correct is ${q.correct}`);

                if (userAnswer && userAnswer === q.correct) {
                    correct++;
                }
            });

            const result = {
                session_id: activeSession.session_id,
                subtest_id: activeSession.subtest_id,
                subtest_name: activeSession.subtest_name,
                score: correct,
                total_questions: activeSession.questions.length,
                score_percentage: (correct / activeSession.questions.length) * 100,
                completed_at: new Date().toISOString(),
                answers: answers,
            };

            console.log("✅ [API] Quiz result calculated:", result);

            // ✅ Simpan ke history
            mockHistory.unshift(result); // Tambah di awal array
            console.log("💾 [API] Saved to history. Total history:", mockHistory.length);

            localStorage.removeItem("active_quiz_session");
            activeSession = null;

            resolve({ data: { success: true, data: result } });
        });
    },

    // ✅ ENDPOINT BARU: Get Quiz History
    getHistory: (limit = 10, offset = 0) => {
        console.log(`📜 [API] Getting quiz history (limit: ${limit}, offset: ${offset})...`);

        const paginatedHistory = mockHistory.slice(offset, offset + limit);

        const response = {
            data: {
                success: true,
                data: paginatedHistory,
                total: mockHistory.length,
                limit: limit,
                offset: offset,
            }
        };

        console.log("✅ [API] History response:", response);
        return Promise.resolve(response);
    },

    // ✅ ENDPOINT BARU: Get Specific Result
    getResult: (sessionId) => {
        console.log(`🔍 [API] Getting result for session: ${sessionId}...`);

        const result = mockHistory.find(h => h.session_id === sessionId);

        if (!result) {
            console.log("❌ [API] Result not found");
            return Promise.reject({
                response: {
                    status: 404,
                    data: { error: "Result not found" }
                }
            });
        }

        console.log("✅ [API] Result found:", result);
        return Promise.resolve({
            data: { success: true, data: result }
        });
    },
};

/**
 * =========================
 * REAL QUIZ API
 * =========================
 */
const realQuizAPI = {
    getSubtests: () => {
        console.log("📚 [API] Fetching subtests from server...");
        return http.get("/subtests").then(res => {
            console.log("✅ [API] Subtests response:", res);
            return res;
        });
    },

    startQuiz: (subtestId) => {
        console.log("🚀 [API] Starting quiz:", subtestId);
        return http.get(`/quiz/start/${subtestId}`).then(res => {
            console.log("✅ [API] Start quiz response:", res);
            return res;
        });
    },

    getActiveQuiz: () => {
        console.log("🔍 [API] Checking active quiz...");
        return http.get("/quiz/active").then(res => {
            console.log("✅ [API] Active quiz response:", res);
            return res;
        });
    },

    cancelQuiz: () => {
        console.log("🗑️ [API] Canceling quiz...");
        return http.delete("/quiz/cancel").then(res => {
            console.log("✅ [API] Cancel response:", res);
            return res;
        });
    },

    submitQuiz: (payload) => {
        console.log("📝 [API] Submitting quiz:", payload);
        return http.post("/quiz/submit", payload).then(res => {
            console.log("✅ [API] Submit response:", res);
            return res;
        });
    },

    getHistory: (limit = 10, offset = 0) => {
        console.log(`📜 [API] Fetching history (limit: ${limit}, offset: ${offset})...`);
        return http.get(`/quiz/history?limit=${limit}&offset=${offset}`).then(res => {
            console.log("✅ [API] History response:", res);
            return res;
        });
    },

    getResult: (sessionId) => {
        console.log(`🔍 [API] Fetching result for session: ${sessionId}...`);
        return http.get(`/quiz/result/${sessionId}`).then(res => {
            console.log("✅ [API] Result response:", res);
            return res;
        });
    },
};

export const quizAPI = MOCK_MODE ? mockQuizAPI : realQuizAPI;