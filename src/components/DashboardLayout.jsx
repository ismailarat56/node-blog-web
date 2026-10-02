import { NavLink, Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <section>
      <nav className="dashboard__nav" aria-label="Yazar paneli">
        <NavLink to="/dashboard" end>
          Yazılarım
        </NavLink>
        <NavLink to="/dashboard/posts/new">Yeni yazı</NavLink>
      </nav>

      <Outlet />
    </section>
  );
}
