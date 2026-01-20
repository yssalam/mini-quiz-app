import { useEffect, useState } from "react";
import { getRemainingSeconds } from "../utils/quizTimer";

export default function useQuizTimer(expiresAt) {
  const [secondsLeft, setSecondsLeft] = useState(
    getRemainingSeconds(expiresAt)
  );

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      setSecondsLeft(getRemainingSeconds(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return {
    secondsLeft,
    isExpired: secondsLeft <= 0,
  };
}
