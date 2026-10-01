import useAuth from "../auth/useAuth.js";
import { formatDate } from "../utils/format-date.js";

const ROLE_LABELS = {
  admin: "Yönetici",
  user: "Üye",
};

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <section className="auth-page">
      <title>Hesabım · Node Blog</title>

      <h1 className="page-title">Hesabım</h1>

      <dl className="account-details">
        <dt>Ad</dt>
        <dd>{user.name}</dd>

        <dt>E-posta</dt>
        <dd>{user.email}</dd>

        <dt>Rol</dt>
        <dd>{ROLE_LABELS[user.role] ?? user.role}</dd>

        <dt>E-posta doğrulama</dt>
        <dd>{formatDate(user.email_verified_at)}</dd>

        <dt>Son giriş</dt>
        <dd>{formatDate(user.last_login_at)}</dd>

        <dt>Üyelik</dt>
        <dd>{formatDate(user.created_at)}</dd>
      </dl>
    </section>
  );
}
