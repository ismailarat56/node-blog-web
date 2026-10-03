import { NavLink, Outlet } from "react-router";

export default function AccountLayout() {
  return (
    <section className="auth-page">
      <nav className="account__nav" aria-label="Hesap ayarları">
        <NavLink to="/account" end>
          Bilgiler
        </NavLink>
        <NavLink to="/account/password">Parola</NavLink>
        <NavLink to="/account/email">E-posta</NavLink>
      </nav>

      <Outlet />
    </section>
  );
}
