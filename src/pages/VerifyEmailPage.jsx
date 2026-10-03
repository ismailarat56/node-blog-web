import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { apiRequest } from "../api/client.js";
import CodeField from "../components/CodeField.jsx";
import FormField from "../components/FormField.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useCountdown from "../hooks/useCountdown.js";
import { describeCodeError } from "../utils/code-errors.js";
import { formatCountdown } from "../utils/format-countdown.js";

const RESEND_WAIT_SECONDS = 60;

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
  const countdown = useCountdown(
    location.state?.codeSent ? RESEND_WAIT_SECONDS : 0
  );

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
      countdown.start(RESEND_WAIT_SECONDS);
    } catch (resendError) {
      setError(resendError);
      countdown.start(resendError.retryAfter ?? 0);
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

        <CodeField value={code} onChange={setCode} />

        {error && (
          <StatusMessage type="error">
            {describeCodeError(error)}
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
            disabled={countdown.isRunning || !email}
            onClick={handleResend}
          >
            {countdown.isRunning
              ? `Yeni kod iste (${formatCountdown(countdown.seconds)})`
              : "Yeni kod iste"}
          </button>
        </div>
      </form>
    </section>
  );
}
