import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { userKeys } from "../../api/query-keys.js";
import useAuth from "../../auth/useAuth.js";
import UserForm from "../../components/admin/UserForm.jsx";
import UserPostList from "../../components/admin/UserPostList.jsx";
import StatusMessage from "../../components/StatusMessage.jsx";
import { formatDate } from "../../utils/format-date.js";
import { toUserFormValues } from "../../utils/user-form.js";

const MISSING_USER_CODES = ["USER_NOT_FOUND", "INVALID_USER_ID"];

export default function AdminUserPage() {
  const { id } = useParams();
  const auth = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [notice, setNotice] = useState(
    location.state?.notice ?? null
  );

  const userQuery = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) =>
      auth.authRequest(`/api/v1/users/${encodeURIComponent(id)}`, {
        signal,
      }),
  });

  if (userQuery.isPending) {
    return <StatusMessage>Kullanıcı yükleniyor...</StatusMessage>;
  }

  if (MISSING_USER_CODES.includes(userQuery.error?.code)) {
    return (
      <StatusMessage type="error">
        Bu kullanıcı bulunamadı. Silinmiş olabilir; listede
        "Silinenleri göster" ile ara.{" "}
        <Link to="/admin/users">Kullanıcılara dön</Link>
      </StatusMessage>
    );
  }

  if (userQuery.error) {
    return (
      <StatusMessage type="error">
        {userQuery.error.message}
      </StatusMessage>
    );
  }

  const user = userQuery.data.data;

  const isAdmin = user.role === "admin";
  const isActive = user.is_active === 1;
  const isSelf = user.id === auth.user.id;

  async function handleSave(values, changes) {
    const { data, message } = await auth.authRequest(
      `/api/v1/users/${user.id}`,
      { method: "PATCH", body: changes }
    );

    setNotice(message);

    if (isSelf) {
      auth.updateUser({ ...auth.user, name: data.name });
    }

    queryClient.setQueryData(userKeys.detail(id), (current) => ({
      ...current,
      data,
    }));

    await queryClient.invalidateQueries({ queryKey: userKeys.lists });
  }

  return (
    <section>
      <title>{`${user.name} · Kullanıcılar · Yönetim · Node Blog`}</title>

      <Link to="/admin/users" className="back-link">
        ← Kullanıcılar
      </Link>

      <h1 className="page-title">{user.name}</h1>

      <dl className="account-details">
        <dt>E-posta</dt>
        <dd>{user.email}</dd>

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
        <dd>{formatDate(user.created_at)}</dd>

        <dt>Son güncelleme</dt>
        <dd>{formatDate(user.updated_at)}</dd>
      </dl>

      <section className="admin-panel">
        <h2>Bilgileri düzenle</h2>

        {notice && <StatusMessage>{notice}</StatusMessage>}

        <UserForm
          key={user.id}
          initialValues={toUserFormValues(user)}
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

      <UserPostList userId={user.id} />
    </section>
  );
}
