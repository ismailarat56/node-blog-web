import { useReducer } from "react";
import { Link } from "react-router";
import useAuth from "../auth/useAuth.js";
import CodeField from "../components/CodeField.jsx";
import FormField from "../components/FormField.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useCountdown from "../hooks/useCountdown.js";
import { describeCodeError } from "../utils/code-errors.js";
import { formatCountdown } from "../utils/format-countdown.js";

const RESEND_WAIT_SECONDS = 60;

const STEPS = [
  { id: "request", label: "1. Yeni adres" },
  { id: "confirm", label: "2. Kod" },
  { id: "done", label: "3. Tamam" },
];

const FIELD_ERRORS = {
  INVALID_EMAIL: {
    field: "new_email",
    message: "Geçerli bir e-posta adresi gir.",
  },
  EMAIL_NOT_CHANGED: {
    field: "new_email",
    message: "Bu zaten şu anki adresin.",
  },
  EMAIL_ALREADY_EXISTS: {
    field: "new_email",
    message: "Bu adresle başka bir hesap var.",
  },
  INVALID_CURRENT_PASSWORD: {
    field: "current_password",
    message: "Mevcut parolanı yaz.",
  },
  CURRENT_PASSWORD_MISMATCH: {
    field: "current_password",
    message: "Mevcut parola hatalı.",
  },
};

const initialState = {
  step: "request",
  new_email: "",
  current_password: "",
  code: "",
  submitting: false,
  error: null,
  notice: null,
};

function emailChangeReducer(state, action) {
  switch (action.type) {
    case "changed":
      return { ...state, [action.name]: action.value };
    case "submitted":
      return {
        ...state,
        submitting: true,
        error: null,
        notice: null,
      };
    case "failed":
      return { ...state, submitting: false, error: action.error };
    case "code_sent":
      return {
        ...state,
        step: "confirm",
        code: "",
        submitting: false,
        notice: action.message,
      };
    case "confirmed":
      return {
        ...initialState,
        step: "done",
        notice: action.message,
      };
    case "restarted":
      return initialState;
    default:
      throw new Error(`Bilinmeyen eylem: ${action.type}`);
  }
}

export default function ChangeEmailPage() {
  const auth = useAuth();
  const countdown = useCountdown();

  const [state, dispatch] = useReducer(
    emailChangeReducer,
    initialState
  );

  const fieldError =
    state.step === "request"
      ? FIELD_ERRORS[state.error?.code]
      : undefined;
  const formError = fieldError ? null : state.error;

  function handleChange(event) {
    dispatch({
      type: "changed",
      name: event.target.name,
      value: event.target.value,
    });
  }

  async function requestCode() {
    dispatch({ type: "submitted" });

    const { new_email, current_password } = state;

    try {
      const { message } = await auth.authRequest(
        "/api/v1/auth/email/change",
        { method: "POST", body: { new_email, current_password } }
      );

      dispatch({ type: "code_sent", message });
      countdown.start(RESEND_WAIT_SECONDS);
    } catch (error) {
      dispatch({ type: "failed", error });

      if (error.retryAfter) {
        countdown.start(error.retryAfter);
      }
    }
  }

  function handleRequestSubmit(event) {
    event.preventDefault();
    requestCode();
  }

  async function handleConfirmSubmit(event) {
    event.preventDefault();
    dispatch({ type: "submitted" });

    try {
      const { data, message } = await auth.authRequest(
        "/api/v1/auth/email/change/confirm",
        { method: "POST", body: { code: state.code } }
      );

      auth.updateUser(data);
      dispatch({ type: "confirmed", message });
    } catch (error) {
      dispatch({ type: "failed", error });
    }
  }

  return (
    <section>
      <title>E-postayı değiştir · Node Blog</title>

      <h1 className="page-title">E-postayı değiştir</h1>

      <ol className="step-list">
        {STEPS.map((step) => (
          <li
            key={step.id}
            aria-current={step.id === state.step ? "step" : undefined}
          >
            {step.label}
          </li>
        ))}
      </ol>

      {state.notice && <StatusMessage>{state.notice}</StatusMessage>}

      {formError && (
        <StatusMessage type="error">
          {describeCodeError(formError)}
        </StatusMessage>
      )}

      {state.step === "request" && (
        <form className="form" onSubmit={handleRequestSubmit}>
          <p>
            Şu anki adresin: <strong>{auth.user.email}</strong>
          </p>

          <FormField
            label="Yeni e-posta"
            name="new_email"
            type="email"
            autoComplete="email"
            required
            value={state.new_email}
            onChange={handleChange}
            error={
              fieldError?.field === "new_email"
                ? fieldError.message
                : undefined
            }
          />

          <FormField
            label="Mevcut parola"
            name="current_password"
            type="password"
            autoComplete="current-password"
            required
            value={state.current_password}
            onChange={handleChange}
            error={
              fieldError?.field === "current_password"
                ? fieldError.message
                : undefined
            }
          />

          <div className="form__actions">
            <button
              type="submit"
              className="button"
              disabled={state.submitting}
            >
              {state.submitting ? "Gönderiliyor..." : "Kod gönder"}
            </button>
          </div>
        </form>
      )}

      {state.step === "confirm" && (
        <form className="form" onSubmit={handleConfirmSubmit}>
          <p>
            Kodu <strong>{state.new_email}</strong> adresine
            gönderdik. Onaylayana kadar adresin değişmez.
          </p>

          <CodeField
            value={state.code}
            onChange={(code) =>
              dispatch({ type: "changed", name: "code", value: code })
            }
          />

          <div className="form__actions">
            <button
              type="submit"
              className="button"
              disabled={state.submitting}
            >
              {state.submitting ? "Onaylanıyor..." : "Onayla"}
            </button>

            <button
              type="button"
              className="link-button"
              disabled={state.submitting || countdown.isRunning}
              onClick={requestCode}
            >
              {countdown.isRunning
                ? `Yeni kod iste (${formatCountdown(countdown.seconds)})`
                : "Yeni kod iste"}
            </button>

            <button
              type="button"
              className="link-button"
              onClick={() => dispatch({ type: "restarted" })}
            >
              Baştan başla
            </button>
          </div>
        </form>
      )}

      {state.step === "done" && (
        <p>
          Yeni adresin: <strong>{auth.user.email}</strong>.{" "}
          <Link to="/account">Hesap bilgilerine dön</Link>
        </p>
      )}
    </section>
  );
}
