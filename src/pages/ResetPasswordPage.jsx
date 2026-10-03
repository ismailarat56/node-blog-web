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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: searchParams.get("email") ?? "",
    code: "",
    new_password: "",
    password_repeat: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(
    location.state?.notice ?? null
  );
  const [submitting, setSubmitting] = useState(false);

  const countdown = useCountdown(
    location.state?.codeSent ? RESEND_WAIT_SECONDS : 0
  );

  const passwordType = showPassword ? "text" : "password";

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleChange(event) {
    updateField(event.target.name, event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});
    setError(null);

    if (form.new_password !== form.password_repeat) {
      setFieldErrors({ password_repeat: "Parolalar aynı değil." });
      return;
    }

    setSubmitting(true);

    const { email, code, new_password } = form;

    try {
      const { message } = await apiRequest(
        "/api/v1/auth/password/reset",
        { method: "POST", body: { email, code, new_password } }
      );

      navigate("/login", {
        replace: true,
        state: { email, notice: message },
      });
    } catch (resetError) {
      if (resetError.code === "INVALID_PASSWORD") {
        setFieldErrors({
          new_password: "Parola 15 ile 128 karakter arasında olmalı.",
        });
      } else {
        setError(resetError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);

    try {
      const { message } = await apiRequest(
        "/api/v1/auth/password/forgot",
        { method: "POST", body: { email: form.email } }
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
      <title>Parolayı sıfırla · Node Blog</title>

      <h1 className="page-title">Parolayı sıfırla</h1>

      {notice && <StatusMessage>{notice}</StatusMessage>}

      <form className="form" onSubmit={handleSubmit}>
        <FormField
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <CodeField
          value={form.code}
          onChange={(code) => updateField("code", code)}
        />

        <FormField
          label="Yeni parola"
          name="new_password"
          type={passwordType}
          autoComplete="new-password"
          required
          minLength={15}
          maxLength={128}
          hint="En az 15 karakter."
          value={form.new_password}
          onChange={handleChange}
          error={fieldErrors.new_password}
        />

        <FormField
          label="Yeni parola (tekrar)"
          name="password_repeat"
          type={passwordType}
          autoComplete="new-password"
          required
          value={form.password_repeat}
          onChange={handleChange}
          error={fieldErrors.password_repeat}
        />

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) =>
              setShowPassword(event.target.checked)
            }
          />
          Parolayı göster
        </label>

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
            {submitting ? "Sıfırlanıyor..." : "Parolayı sıfırla"}
          </button>

          <button
            type="button"
            className="link-button"
            disabled={countdown.isRunning || !form.email}
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
