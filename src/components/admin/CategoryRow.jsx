import { useOptimistic, useTransition } from "react";
import { Link } from "react-router";
import { getCategoryStatus } from "../../utils/category-status.js";
import { formatDate } from "../../utils/format-date.js";

export default function CategoryRow({
  category,
  onEdit,
  onToggleActive,
  onDelete,
  onRestore,
}) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(
    category.is_active
  );
  const [isPending, startTransition] = useTransition();

  const isDeleted = category.deleted_at !== null;
  const status = getCategoryStatus({
    ...category,
    is_active: optimisticActive,
  });

  function handleToggle() {
    const nextActive = optimisticActive === 1 ? 0 : 1;

    startTransition(async () => {
      setOptimisticActive(nextActive);
      await onToggleActive(category, nextActive);
    });
  }

  return (
    <tr data-deleted={isDeleted}>
      <td>{category.name}</td>
      <td>
        <code>{category.slug}</code>
      </td>
      <td>
        <span className={`badge badge--${status.key}`}>
          {status.label}
        </span>
      </td>
      <td>{formatDate(category.created_at)}</td>
      <td>
        <div className="post-table__actions">
          <Link to={`/admin/posts?category=${category.id}`}>Yazıları</Link>
          {!isDeleted && (
            <>
              <button
                type="button"
                className="link-button"
                onClick={() => onEdit(category)}
              >
                Düzenle
              </button>
              <button
                type="button"
                className="link-button"
                disabled={isPending}
                onClick={handleToggle}
              >
                {optimisticActive === 1 ? "Pasifleştir" : "Aktifleştir"}
              </button>
              <button
                type="button"
                className="link-button link-button--danger"
                onClick={() => onDelete(category)}
              >
                Sil
              </button>
            </>
          )}
          {isDeleted && (
            <button
              type="button"
              className="link-button"
              onClick={() => onRestore(category)}
            >
              Geri getir
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
