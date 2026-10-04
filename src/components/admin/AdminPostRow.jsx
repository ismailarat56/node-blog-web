import { Link } from "react-router";
import { formatDate } from "../../utils/format-date.js";
import { STATUS_LABELS } from "../../utils/post-status.js";

export default function AdminPostRow({ post, onDelete, onRestore }) {
  const isDeleted = post.deleted_at !== null;

  return (
    <tr data-deleted={isDeleted}>
      <td>{post.title}</td>
      <td>{post.author.name}</td>
      <td>{post.category.name}</td>
      <td>
        {isDeleted ? (
          <span className="badge badge--deleted">Silindi</span>
        ) : (
          <span className={`badge badge--${post.status}`}>
            {STATUS_LABELS[post.status]}
          </span>
        )}
      </td>
      <td>{formatDate(post.updated_at)}</td>
      <td>
        <div className="post-table__actions">
          {isDeleted ? (
            <button
              type="button"
              className="link-button"
              onClick={() => onRestore(post)}
            >
              Geri getir
            </button>
          ) : (
            <>
              <Link to={`/dashboard/posts/${post.id}/edit`}>Düzenle</Link>
              <button
                type="button"
                className="link-button link-button--danger"
                onClick={() => onDelete(post)}
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
