import { useState } from "react";
import useAuth from "../../auth/useAuth.js";
import AdminPostRow from "../../components/admin/AdminPostRow.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Pagination from "../../components/Pagination.jsx";
import StatusMessage from "../../components/StatusMessage.jsx";
import useApi from "../../hooks/useApi.js";
import useDebouncedValue from "../../hooks/useDebouncedValue.js";

const PAGE_SIZE = 10;
const SEARCH_DELAY = 400;

const STATUS_FILTERS = [
  { value: null, label: "Tümü" },
  { value: "draft", label: "Taslaklar" },
  { value: "published", label: "Yayında" },
];

function buildPostsPath({ search, status, showDeleted, page }) {
  const params = new URLSearchParams({
    sort_by: "updated_at",
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  if (search !== "") {
    params.set("search", search);
  }

  if (status !== null) {
    params.set("status", status);
  }

  if (showDeleted) {
    params.set("include_deleted", "1");
  }

  return `/api/v1/posts?${params}`;
}

export default function AdminPostsPage() {
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebouncedValue(
    search.trim(),
    SEARCH_DELAY
  );

  const posts = useApi(
    buildPostsPath({
      search: debouncedSearch,
      status,
      showDeleted,
      page,
    }),
    auth.authRequest
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleStatusChange(nextStatus) {
    setStatus(nextStatus);
    setPage(1);
  }

  function handleShowDeletedChange(event) {
    setShowDeleted(event.target.checked);
    setPage(1);
  }

  function askDelete(post) {
    setNotice(null);
    setDeleteError(null);
    setDeleteTarget(post);
  }

  function closeDeleteDialog() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);

    try {
      await auth.authRequest(`/api/v1/posts/${deleteTarget.id}`, {
        method: "DELETE",
      });

      setNotice(`"${deleteTarget.title}" silindi.`);
      setDeleteTarget(null);
      posts.reload();
    } catch (deleteFailure) {
      setDeleteError(deleteFailure);
    } finally {
      setDeleting(false);
    }
  }

  async function handleRestore(post) {
    setNotice(null);
    setActionError(null);

    try {
      await auth.authRequest(`/api/v1/posts/${post.id}/restore`, {
        method: "PATCH",
      });

      setNotice(`"${post.title}" geri getirildi.`);
      posts.reload();
    } catch (restoreError) {
      setActionError(restoreError);
    }
  }

  return (
    <section>
      <title>Yazılar · Yönetim · Node Blog</title>
      <h1 className="page-title">Bütün yazılar</h1>

      <div className="toolbar">
        <input
          type="search"
          aria-label="Yazı ara"
          placeholder="Başlık veya özet"
          value={search}
          onChange={handleSearchChange}
        />

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeletedChange}
          />
          Silinenleri göster
        </label>
      </div>

      <nav className="category-filter" aria-label="Durum">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className="chip"
            aria-pressed={status === filter.value}
            onClick={() => handleStatusChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {actionError && (
        <StatusMessage type="error">{actionError.message}</StatusMessage>
      )}

      {posts.loading && (
        <StatusMessage>Yazılar yükleniyor...</StatusMessage>
      )}

      {posts.error && (
        <StatusMessage type="error">{posts.error.message}</StatusMessage>
      )}

      {posts.data?.length === 0 && (
        <StatusMessage>Bu listede yazı yok.</StatusMessage>
      )}

      {posts.data?.length > 0 && (
        <>
          <table className="post-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Yazar</th>
                <th>Kategori</th>
                <th>Durum</th>
                <th>Güncelleme</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {posts.data.map((post) => (
                <AdminPostRow
                  key={post.id}
                  post={post}
                  onDelete={askDelete}
                  onRestore={handleRestore}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={posts.meta.total_pages}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Yazıyı sil"
        confirmLabel="Sil"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onClose={closeDeleteDialog}
      >
        <p>
          "{deleteTarget?.title}" silinecek. Yazarı da sen de
          "Silinenleri göster" ile geri getirebilirsiniz.
        </p>

        {deleteError && (
          <StatusMessage type="error">{deleteError.message}</StatusMessage>
        )}
      </ConfirmDialog>
    </section>
  );
}
