import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import useAuth from "../auth/useAuth.js";
import Pagination from "../components/Pagination.jsx";
import PostRow from "../components/PostRow.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useApi from "../hooks/useApi.js";
import { parsePositiveInt } from "../utils/parse-positive-int.js";

const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { value: null, label: "Tümü" },
  { value: "draft", label: "Taslaklar" },
  { value: "published", label: "Yayında" },
];

function parseStatus(value) {
  if (value === "draft" || value === "published") {
    return value;
  }

  return null;
}

function buildMyPostsPath(userId, status, page) {
  const params = new URLSearchParams({
    user_id: String(userId),
    sort_by: "updated_at",
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  if (status !== null) {
    params.set("status", status);
  }

  return `/api/v1/posts?${params}`;
}

export default function DashboardPage() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = parseStatus(searchParams.get("status"));
  const page =
    parsePositiveInt(searchParams.get("page")) ?? 1;

  const [deletingId, setDeletingId] = useState(null);
  const [deletedPost, setDeletedPost] = useState(null);
  const [notice, setNotice] = useState(null);
  const [actionError, setActionError] = useState(null);

  const posts = useApi(
    buildMyPostsPath(auth.user.id, status, page),
    auth.authRequest
  );

  function updateFilters(nextStatus, nextPage) {
    const nextParams = new URLSearchParams();

    if (nextStatus !== null) {
      nextParams.set("status", nextStatus);
    }

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
  }

  async function handleDelete(post) {
    if (!window.confirm(`"${post.title}" silinsin mi?`)) {
      return;
    }

    setDeletingId(post.id);
    setNotice(null);
    setActionError(null);

    try {
      await auth.authRequest(`/api/v1/posts/${post.id}`, {
        method: "DELETE",
      });

      setDeletedPost(post);
      posts.reload();
    } catch (deleteError) {
      setActionError(deleteError);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUndo() {
    setActionError(null);

    try {
      await auth.authRequest(
        `/api/v1/posts/${deletedPost.id}/restore`,
        { method: "PATCH" }
      );

      setNotice(`"${deletedPost.title}" geri getirildi.`);
      setDeletedPost(null);
      posts.reload();
    } catch (restoreError) {
      setActionError(restoreError);
    }
  }

  return (
    <section>
      <title>Yazılarım · Node Blog</title>

      <div className="dashboard__header">
        <h1 className="page-title">Yazılarım</h1>

        <Link to="/dashboard/posts/new" className="button">
          Yeni yazı
        </Link>
      </div>

      <nav className="category-filter" aria-label="Durum">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className="chip"
            aria-pressed={status === filter.value}
            onClick={() => updateFilters(filter.value, 1)}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      {deletedPost && (
        <StatusMessage>
          "{deletedPost.title}" silindi.{" "}
          <button
            type="button"
            className="link-button"
            onClick={handleUndo}
          >
            Geri al
          </button>
        </StatusMessage>
      )}

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {actionError && (
        <StatusMessage type="error">
          {actionError.message}
        </StatusMessage>
      )}

      {posts.loading && (
        <StatusMessage>Yazıların yükleniyor...</StatusMessage>
      )}

      {posts.error && (
        <StatusMessage type="error">
          {posts.error.message}
        </StatusMessage>
      )}

      {posts.data?.length === 0 && (
        <StatusMessage>
          Bu listede yazın yok.{" "}
          <Link to="/dashboard/posts/new">
            Yeni bir yazı başlat
          </Link>
        </StatusMessage>
      )}

      {posts.data?.length > 0 && (
        <>
          <table className="post-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Durum</th>
                <th>Kategori</th>
                <th>Güncelleme</th>
                <th>Yorum</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {posts.data.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  deleting={deletingId === post.id}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={posts.meta.total_pages}
            onPageChange={(nextPage) =>
              updateFilters(status, nextPage)
            }
          />
        </>
      )}
    </section>
  );
}
