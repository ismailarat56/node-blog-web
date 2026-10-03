import { useState } from "react";
import useAuth from "../auth/useAuth.js";
import CodeField from "../components/CodeField.jsx";
import FormField from "../components/FormField.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useCountdown from "../hooks/useCountdown.js";
import { describeCodeError } from "../utils/code-errors.js";
import { formatCountdown } from "../utils/format-countdown.js";

const RESEND_WAIT_SECONDS = 60;

const FIELD_ERRORS = {
  INVALID_CURRENT_PASSWORD: {
    field: "current_password",
    message: "Mevcut parolanı yaz.",
  },
  CURRENT_PASSWORD_MISMATCH: {
    field: "current_password",
    message: "Mevcut parola hatalı.",
  },
  INVALID_PASSWORD: {
    field: "new_password",
    message: "Parola 15 ile 128 karakter arasında olmalı.",
  },
  PASSWORD_NOT_CHANGED: {
    field: "new_password",
    message: "Yeni parola mevcut paroladan farklı olmalı.",
  },
  INVALID_VERIFICATION_CODE_FORMAT: {
    field: "code",
    message: "Kod 6 haneli olmalı.",
  },
  INVALID_VERIFICATION_CODE: {
    field: "code",
    message: "Kod hatalı veya süresi dolmuş.",
  },
};

const EMPTY_FORM = {
  current_password: "",
  new_password: "",
  password_repeat: "",
  code: "",
};

export default function ChangePasswordPage() {
  const auth = useAuth();
  const countdown = useCountdown();

  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [requesting, setRequesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const passwordType = showPassword ? "text" : "password";

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleChange(event) {
    updateField(event.target.name, event.target.value);
  }

  async function handleRequestCode() {
    setRequesting(true);
    setNotice(null);
    setError(null);

    try {
      const { message } = await auth.authRequest(
        "/api/v1/auth/password/change-code",
        { method: "POST" }
      );

      setNotice(`${message} (${auth.user.email})`);
      countdown.start(RESEND_WAIT_SECONDS);
    } catch (codeError) {
      setError(codeError);

      if (codeError.retryAfter) {
        countdown.start(codeError.retryAfter);
      }
    } finally {
      setRequesting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});
    setNotice(null);
    setError(null);

    if (form.new_password !== form.password_repeat) {
      setFieldErrors({ password_repeat: "Parolalar aynı değil." });
      return;
    }

    setSubmitting(true);

    const { current_password, new_password, code } = form;
    const email = auth.user.email;

    try {
      const { message } = await auth.authRequest(
        "/api/v1/auth/password",
        {
          method: "PATCH",
          body: { current_password, new_password, code },
        }
      );

      auth.closeSession({ email, notice: message });
    } catch (changeError) {
      const known = FIELD_ERRORS[changeError.code];

      if (known) {
        setFieldErrors({ [known.field]: known.message });
      } else {
        setError(changeError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <title>Parolayı değiştir · Node Blog</title>

      <h1 className="page-title">Parolayı değiştir</h1>

      <p>
        Önce e-posta adresine bir kod iste. Kod 10 dakika
        geçerli. Parola değişince bütün oturumların kapanır.
      </p>

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {error && (
        <StatusMessage type="error">
          {describeCodeError(error)}
        </StatusMessage>
      )}

      <div className="form__actions">
        <button
          type="button"
          className="button"
          disabled={requesting || countdown.isRunning}
          onClick={handleRequestCode}
        >
          {countdown.isRunning
            ? `Yeni kod (${formatCountdown(countdown.seconds)})`
            : "Kod gönder"}
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <FormField
          label="Mevcut parola"
          name="current_password"
          type={passwordType}
          autoComplete="current-password"
          required
          value={form.current_password}
          onChange={handleChange}
          error={fieldErrors.current_password}
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
          Parolaları göster
        </label>

        <CodeField
          value={form.code}
          onChange={(code) => updateField("code", code)}
          error={fieldErrors.code}
        />

        <div className="form__actions">
          <button
            type="submit"
            className="button"
            disabled={submitting}
          >
            {submitting ? "Değiştiriliyor..." : "Parolayı değiştir"}
          </button>
        </div>
      </form>
    </section>
  );
}
