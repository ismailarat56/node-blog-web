import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth.js";
import { formatCountdown } from "../utils/format-countdown.js";

const WARNING_SECONDS = 120;

export default function SessionExpiryNotice() {
  const { expiresAt } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (expiresAt === null) {
      return;
    }

    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, [expiresAt]);

  if (expiresAt === null) {
    return null;
  }

  const secondsLeft = Math.ceil((expiresAt - now) / 1000);

  if (secondsLeft > WARNING_SECONDS || secondsLeft <= 0) {
    return null;
  }

  return (
    <p className="app-banner" role="status">
      Oturumun {formatCountdown(secondsLeft)} sonra kapanacak.
      Kaydetmediğin bir değişiklik varsa şimdi kaydet.
    </p>
  );
}
