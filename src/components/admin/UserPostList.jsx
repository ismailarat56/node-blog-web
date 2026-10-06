import { Link } from "react-router";
import useAuth from "../../auth/useAuth.js";
import useApi from "../../hooks/useApi.js";
import { formatDate } from "../../utils/format-date.js";
import { STATUS_LABELS } from "../../utils/post-status.js";
import StatusMessage from "../StatusMessage.jsx";

function buildUserPostsPath(userId) {
  const params = new URLSearchParams({
    user_id: String(userId),
    include_deleted: "1",
    sort_by: "updated_at",
    limit: "10",
  });

  return `/api/v1/posts?${params}`;
}

export default function UserPostList({ userId }) {
  const auth = useAuth();

  const posts = useApi(
    buildUserPostsPath(userId),
    auth.authRequest
  );

  return (
    <section className="admin-panel">
      <h2>Yazıları</h2>

      {posts.loading && (
        <StatusMessage>Yazılar yükleniyor...</StatusMessage>
      )}

      {posts.error && (
        <StatusMessage type="error">{posts.error.message}</StatusMessage>
      )}

      {posts.data?.length === 0 && (
        <p className="form__hint">Bu kullanıcının hiç yazısı yok.</p>
      )}

      {posts.data?.length > 0 && (
        <>
          <p className="form__hint">
            Silinenler dahil {posts.meta.total} yazı
            {posts.meta.total > posts.data.length &&
              `; en son güncellenen ${posts.data.length} tanesi`}
            .
          </p>

          <table className="post-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Durum</th>
                <th>Güncelleme</th>
              </tr>
            </thead>

            <tbody>
              {posts.data.map((post) => {
                const isDeleted = post.deleted_at !== null;

                return (
                  <tr key={post.id} data-deleted={isDeleted}>
                    <td>
                      {isDeleted ? (
                        post.title
                      ) : (
                        <Link to={`/dashboard/posts/${post.id}/edit`}>
                          {post.title}
                        </Link>
                      )}
                    </td>
                    <td>
                      {isDeleted ? (
                        <span className="badge badge--deleted">
                          Silindi
                        </span>
                      ) : (
                        <span className={`badge badge--${post.status}`}>
                          {STATUS_LABELS[post.status]}
                        </span>
                      )}
                    </td>
                    <td>{formatDate(post.updated_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
