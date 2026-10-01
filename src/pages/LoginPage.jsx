import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import useAuth from "../auth/useAuth.js";
import StatusMessage from "../components/StatusMessage.jsx";

function describeLoginError(error) {
  if (error.code === "INVALID_CREDENTIALS") {
    return "E-posta veya parola hatalı.";
  }

  if (error.code === "RATE_LIMITED") {
    const minutes = Math.ceil((error.retryAfter ?? 60) / 60);

    return `Çok fazla deneme yaptın. ${minutes} dakika sonra tekrar dene.`;
  }

  return error.message;
}

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email ?? ""
  );
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (auth.status === "authenticated") {
    return (
      <Navigate to={location.state?.from ?? "/"} replace />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await auth.login(email, password);
    } catch (loginError) {
      if (loginError.code === "EMAIL_NOT_VERIFIED") {
        const params = new URLSearchParams({ email });

        navigate(`/verify-email?${params}`, {
          state: { notice: loginError.message },
        });
        return;
      }

      setError(loginError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <title>Giriş yap · Node Blog</title>

      <h1 className="page-title">Giriş yap</h1>

      {location.state?.notice && (
        <StatusMessage>
          {location.state.notice}
        </StatusMessage>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label htmlFor="login-email">E-posta</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form__field">
          <label htmlFor="login-password">Parola</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        {error && (
          <StatusMessage type="error">
            {describeLoginError(error)}
          </StatusMessage>
        )}

        <div className="form__actions">
          <button
            type="submit"
            className="button"
            disabled={submitting}
          >
            {submitting ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>

          <Link to="/register">Hesabın yok mu? Kayıt ol</Link>
        </div>
      </form>
    </section>
  );
}
