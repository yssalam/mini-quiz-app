import { useEffect, useState } from "react";
import { quizAPI } from "../services/quizApi";

export default function useActiveQuiz() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveQuiz = async () => {
      try {
        const res = await quizAPI.getActiveQuiz();
        if (res.success && res.data) {
          setActiveQuiz(res.data);
        }
      } catch (err) {
        console.log("No active quiz");
      } finally {
        setLoading(false);
      }
    };

    checkActiveQuiz();
  }, []);

  return { activeQuiz, setActiveQuiz, loading };
}
