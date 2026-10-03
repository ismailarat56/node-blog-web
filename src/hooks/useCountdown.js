import { useEffect, useState } from "react";

export default function useCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);

  const isRunning = seconds > 0;

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = setInterval(() => {
      setSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning]);

  return {
    seconds,
    isRunning,
    start: setSeconds,
  };
}
