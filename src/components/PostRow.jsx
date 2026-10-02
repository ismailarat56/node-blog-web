import { Link } from "react-router";
import { formatDate } from "../utils/format-date.js";
import { STATUS_LABELS } from "../utils/post-status.js";

export default function PostRow({
  post,
  deleting,
  onDelete,
}) {
  const editUrl = `/dashboard/posts/${post.id}/edit`;

  return (
    <tr>
      <td>
        <Link to={editUrl}>{post.title}</Link>
      </td>
      <td>
        <span className={`badge badge--${post.status}`}>
          {STATUS_LABELS[post.status]}
        </span>
      </td>
      <td>{post.category.name}</td>
      <td>{formatDate(post.updated_at)}</td>
      <td>{post.comment_count}</td>
      <td>
        <div className="post-table__actions">
          {post.status === "published" && (
            <Link to={`/posts/${post.slug}`}>Gör</Link>
          )}
          <Link to={editUrl}>Düzenle</Link>
          <button
            type="button"
            className="link-button link-button--danger"
            disabled={deleting}
            onClick={() => onDelete(post)}
          >
            {deleting ? "Siliniyor..." : "Sil"}
          </button>
        </div>
      </td>
    </tr>
  );
}
