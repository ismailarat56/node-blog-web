import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import useAuth from "../../auth/useAuth.js";
import UserForm from "../../components/admin/UserForm.jsx";
import UserPostList from "../../components/admin/UserPostList.jsx";
import StatusMessage from "../../components/StatusMessage.jsx";
import useApi from "../../hooks/useApi.js";
import { formatDate } from "../../utils/format-date.js";
import { toUserFormValues } from "../../utils/user-form.js";

const MISSING_USER_CODES = ["USER_NOT_FOUND", "INVALID_USER_ID"];

export default function AdminUserPage() {
  const { id } = useParams();
  const auth = useAuth();
  const location = useLocation();

  const [notice, setNotice] = useState(
    location.state?.notice ?? null
  );

  const user = useApi(
    `/api/v1/users/${encodeURIComponent(id)}`,
    auth.authRequest
  );

  if (user.loading) {
    return <StatusMessage>Kullanıcı yükleniyor...</StatusMessage>;
  }

  if (MISSING_USER_CODES.includes(user.error?.code)) {
    return (
      <StatusMessage type="error">
        Bu kullanıcı bulunamadı. Silinmiş olabilir; listede
        "Silinenleri göster" ile ara.{" "}
        <Link to="/admin/users">Kullanıcılara dön</Link>
      </StatusMessage>
    );
  }

  if (user.error) {
    return (
      <StatusMessage type="error">{user.error.message}</StatusMessage>
    );
  }

  const isAdmin = user.data.role === "admin";
  const isActive = user.data.is_active === 1;
  const isSelf = user.data.id === auth.user.id;

  async function handleSave(values, changes) {
    const { data, message } = await auth.authRequest(
      `/api/v1/users/${user.data.id}`,
      { method: "PATCH", body: changes }
    );

    setNotice(message);

    if (isSelf) {
      auth.updateUser({ ...auth.user, name: data.name });
    }

    user.reload();
  }

  return (
    <section>
      <title>{`${user.data.name} · Kullanıcılar · Yönetim · Node Blog`}</title>

      <Link to="/admin/users" className="back-link">
        ← Kullanıcılar
      </Link>

      <h1 className="page-title">{user.data.name}</h1>

      <dl className="account-details">
        <dt>E-posta</dt>
        <dd>{user.data.email}</dd>

        <dt>Rol</dt>
        <dd>
          <span className={isAdmin ? "badge badge--admin" : "badge"}>
            {isAdmin ? "Yönetici" : "Kullanıcı"}
          </span>
        </dd>

        <dt>Durum</dt>
        <dd>
          <span
            className={
              isActive ? "badge badge--active" : "badge badge--inactive"
            }
          >
            {isActive ? "Aktif" : "Pasif"}
          </span>
        </dd>

        <dt>Kayıt</dt>
        <dd>{formatDate(user.data.created_at)}</dd>

        <dt>Son güncelleme</dt>
        <dd>{formatDate(user.data.updated_at)}</dd>
      </dl>

      <section className="admin-panel">
        <h2>Bilgileri düzenle</h2>

        {notice && <StatusMessage>{notice}</StatusMessage>}

        <UserForm
          key={user.data.id}
          initialValues={toUserFormValues(user.data)}
          emailLocked={isSelf}
          emailHint={
            isSelf ? (
              <>
                Kendi adresini{" "}
                <Link to="/account/email">Hesabım → E-posta</Link>{" "}
                sayfasından kodla değiştir.
              </>
            ) : (
              "Yeni adrese kod gitmez; değişiklik hemen geçerli olur."
            )
          }
          submitLabel="Kaydet"
          submittingLabel="Kaydediliyor..."
          onSubmit={handleSave}
        />
      </section>

      <UserPostList userId={user.data.id} />
    </section>
  );
}
