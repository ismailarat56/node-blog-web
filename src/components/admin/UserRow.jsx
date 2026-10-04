import { formatDate } from "../../utils/format-date.js";

const SELF_HINT = "Kendi hesabında bu işlemi yapamazsın.";

export default function UserRow({ user, isSelf, onChange }) {
  const isAdmin = user.role === "admin";
  const isActive = user.is_active === 1;

  return (
    <tr>
      <td>
        {user.name}
        {isSelf && <span className="form__hint"> (sen)</span>}
      </td>
      <td>{user.email}</td>
      <td>
        <span className={isAdmin ? "badge badge--admin" : "badge"}>
          {isAdmin ? "Yönetici" : "Kullanıcı"}
        </span>
      </td>
      <td>
        <span
          className={
            isActive ? "badge badge--active" : "badge badge--inactive"
          }
        >
          {isActive ? "Aktif" : "Pasif"}
        </span>
      </td>
      <td>{formatDate(user.created_at)}</td>
      <td>
        <div className="post-table__actions">
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
        </div>
      </td>
    </tr>
  );
}
