import { useActionState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { apiRequest } from "../api/client.js";
import FormField from "../components/FormField.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { describeCodeError } from "../utils/code-errors.js";

export default function ForgotPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  async function requestResetCode(previousState, formData) {
    const email = String(formData.get("email")).trim();

    try {
      const { message } = await apiRequest(
        "/api/v1/auth/password/forgot",
        { method: "POST", body: { email } }
      );

      const params = new URLSearchParams({ email });

      navigate(`/reset-password?${params}`, {
        state: { notice: message, codeSent: true },
      });

      return { email, error: null };
    } catch (error) {
      return { email, error };
    }
  }

  const [state, formAction, isPending] = useActionState(
    requestResetCode,
    { email: location.state?.email ?? "", error: null }
  );

  return (
    <section className="auth-page">
      <title>Şifremi unuttum · Node Blog</title>

      <h1 className="page-title">Şifremi unuttum</h1>

      <p>
        E-posta adresini yaz. Bu adresle bir hesap varsa 6 haneli
        bir kod göndereceğiz.
      </p>

      <form className="form" action={formAction}>
        <FormField
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
        />

        {state.error && (
          <StatusMessage type="error">
            {describeCodeError(state.error)}
          </StatusMessage>
        )}

        <div className="form__actions">
          <button
            type="submit"
            className="button"
            disabled={isPending}
          >
            {isPending ? "Gönderiliyor..." : "Kod gönder"}
          </button>

          <Link to="/login">Girişe dön</Link>
        </div>
      </form>
    </section>
  );
}
