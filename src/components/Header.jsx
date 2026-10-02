import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";
import useAuth from "../auth/useAuth.js";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await auth.logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          Node Blog
        </Link>
        <span className="header__tagline">
          Node.js, MySQL ve React notları
        </span>

        <nav className="header__nav" aria-label="Hesap">
          {auth.status === "authenticated" && (
            <>
              <NavLink to="/dashboard">Yazılarım</NavLink>
              <NavLink to="/account">{auth.user.name}</NavLink>
              <button
                type="button"
                className="link-button"
                onClick={handleLogout}
              >
                Çıkış
              </button>
            </>
          )}

          {auth.status === "anonymous" && (
            <>
              <NavLink to="/login" state={{ from: location }}>
                Giriş
              </NavLink>
              <NavLink to="/register">Kayıt ol</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
