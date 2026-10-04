import { Suspense } from "react";
import { NavLink, Outlet } from "react-router";
import StatusMessage from "./StatusMessage.jsx";

export default function AdminLayout() {
  return (
    <section>
      <nav className="admin__nav" aria-label="Yönetim paneli">
        <NavLink to="/admin" end>
          Kategoriler
        </NavLink>
        <NavLink to="/admin/posts">Yazılar</NavLink>
        <NavLink to="/admin/users">Kullanıcılar</NavLink>
      </nav>

      <Suspense
        fallback={
          <StatusMessage>Yönetim sayfası yükleniyor...</StatusMessage>
        }
      >
        <Outlet />
      </Suspense>
    </section>
  );
}
