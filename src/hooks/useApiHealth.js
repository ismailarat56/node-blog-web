import { useEffect, useState } from "react";
import {
  API_TROUBLE_EVENT,
  checkApiHealth,
} from "../api/health.js";

const RETRY_DELAY = 10_000;

function nextAttempt(current) {
  return current + 1;
}

export default function useApiHealth() {
  const [status, setStatus] = useState("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    checkApiHealth(controller.signal)
      .then((isUp) => {
        setStatus(isUp ? "up" : "down");
      })
      .catch(() => {
        // Yalnız AbortError gelir: yerine yeni kontrol başladı.
      });

    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    function handleTrouble() {
      setAttempt(nextAttempt);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setAttempt(nextAttempt);
      }
    }

    window.addEventListener(API_TROUBLE_EVENT, handleTrouble);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(API_TROUBLE_EVENT, handleTrouble);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    if (status !== "down") {
      return;
    }

    const timerId = setTimeout(() => {
      setAttempt(nextAttempt);
    }, RETRY_DELAY);

    return () => clearTimeout(timerId);
  }, [status, attempt]);

  function recheck() {
    setAttempt(nextAttempt);
  }

  return { status, recheck };
}
