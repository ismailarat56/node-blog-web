import { Link, useNavigate } from "react-router";
import useAuth from "../../auth/useAuth.js";
import UserForm from "../../components/admin/UserForm.jsx";
import { EMPTY_USER } from "../../utils/user-form.js";

export default function AdminNewUserPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleCreate(values) {
    const { data, message } = await auth.authRequest(
      "/api/v1/users",
      { method: "POST", body: values }
    );

    navigate(`/admin/users/${data.id}`, {
      state: {
        notice: `${message} ${data.email} henüz doğrulanmadı; ilk girişte kod istenecek.`,
      },
    });
  }

  return (
    <section>
      <title>Yeni kullanıcı · Yönetim · Node Blog</title>

      <Link to="/admin/users" className="back-link">
        ← Kullanıcılar
      </Link>

      <h1 className="page-title">Yeni kullanıcı</h1>

      <p className="form__hint">
        Yeni hesap her zaman "Kullanıcı" rolünde ve aktif açılır.
        Rolü sonra listeden değiştirebilirsin.
      </p>

      <UserForm
        initialValues={EMPTY_USER}
        submitLabel="Oluştur"
        submittingLabel="Oluşturuluyor..."
        onSubmit={handleCreate}
      />
    </section>
  );
}
