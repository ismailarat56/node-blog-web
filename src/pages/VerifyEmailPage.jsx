import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { apiRequest } from "../api/client.js";
import FormField from "../components/FormField.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

const RESEND_WAIT_SECONDS = 60;

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${rest}`;
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    searchParams.get("email") ?? ""
  );
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(
    location.state?.notice ?? null
  );
  const [cooldown, setCooldown] = useState(
    location.state?.codeSent ? RESEND_WAIT_SECONDS : 0
  );

  const isCoolingDown = cooldown > 0;

  useEffect(() => {
    if (!isCoolingDown) {
      return;
    }

    const timerId = setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isCoolingDown]);

  async function handleVerify(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { message } = await apiRequest(
        "/api/v1/auth/email/verify",
        {
          method: "POST",
          body: { email, code },
        }
      );

      navigate("/login", {
        state: { email, notice: message },
      });
    } catch (verifyError) {
      setError(verifyError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);

    try {
      const { message } = await apiRequest(
        "/api/v1/auth/email/verify/resend",
        {
          method: "POST",
          body: { email },
        }
      );

      setNotice(message);
      setCooldown(RESEND_WAIT_SECONDS);
    } catch (resendError) {
      setError(resendError);
      setCooldown(resendError.retryAfter ?? 0);
    }
  }

  return (
    <section className="auth-page">
      <title>E-posta doğrulama · Node Blog</title>

      <h1 className="page-title">E-postanı doğrula</h1>

      {notice && <StatusMessage>{notice}</StatusMessage>}

      <form className="form" onSubmit={handleVerify}>
        <FormField
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <FormField
          label="Doğrulama kodu"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          hint="E-postana gelen 6 haneli kod. 10 dakika geçerli."
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, ""))
          }
        />

        {error && (
          <StatusMessage type="error">
            {error.message}
          </StatusMessage>
        )}

        <div className="form__actions">
          <button
            type="submit"
            className="button"
            disabled={submitting}
          >
            {submitting ? "Doğrulanıyor..." : "Doğrula"}
          </button>

          <button
            type="button"
            className="link-button"
            disabled={isCoolingDown || !email}
            onClick={handleResend}
          >
            {isCoolingDown
              ? `Yeni kod iste (${formatCountdown(cooldown)})`
              : "Yeni kod iste"}
          </button>
        </div>
      </form>
    </section>
  );
}
