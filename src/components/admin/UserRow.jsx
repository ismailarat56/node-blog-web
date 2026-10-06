import { Link } from "react-router";
import { formatDate } from "../../utils/format-date.js";

const SELF_HINT = "Kendi hesabında bu işlemi yapamazsın.";

function StatusBadge({ user }) {
  if (user.deleted_at !== null) {
    return <span className="badge badge--deleted">Silindi</span>;
  }

  if (user.is_active === 1) {
    return <span className="badge badge--active">Aktif</span>;
  }

  return <span className="badge badge--inactive">Pasif</span>;
}

export default function UserRow({
  user,
  isSelf,
  onChange,
  onRestore,
}) {
  const isAdmin = user.role === "admin";
  const isActive = user.is_active === 1;
  const isDeleted = user.deleted_at !== null;

  return (
    <tr data-deleted={isDeleted}>
      <td>
        {isDeleted ? (
          user.name
        ) : (
          <Link to={`/admin/users/${user.id}`}>{user.name}</Link>
        )}
        {isSelf && <span className="form__hint"> (sen)</span>}
      </td>
      <td>{user.email}</td>
      <td>
        <span className={isAdmin ? "badge badge--admin" : "badge"}>
          {isAdmin ? "Yönetici" : "Kullanıcı"}
        </span>
      </td>
      <td>
        <StatusBadge user={user} />
      </td>
      <td>{formatDate(user.created_at)}</td>
      <td>
        <div className="post-table__actions">
          {isDeleted ? (
            <button
              type="button"
              className="link-button"
              onClick={() => onRestore(user)}
            >
              Geri getir
            </button>
          ) : (
            <>
              <button
                type="button"
                className="link-button"
                disabled={isSelf}
                title={isSelf ? SELF_HINT : undefined}
                onClick={() =>
                  onChange({
                    user,
                    field: "role",
                    value: isAdmin ? "user" : "admin",
                  })
                }
              >
                {isAdmin ? "Kullanıcı yap" : "Yönetici yap"}
              </button>
              <button
                type="button"
                className="link-button"
                disabled={isSelf}
                title={isSelf ? SELF_HINT : undefined}
                onClick={() =>
                  onChange({
                    user,
                    field: "is_active",
                    value: isActive ? 0 : 1,
                  })
                }
              >
                {isActive ? "Pasifleştir" : "Aktifleştir"}
              </button>
              <button
                type="button"
                className="link-button link-button--danger"
                disabled={isSelf}
                title={isSelf ? SELF_HINT : undefined}
                onClick={() =>
                  onChange({ user, field: "deleted", value: true })
                }
              >
                Sil
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
