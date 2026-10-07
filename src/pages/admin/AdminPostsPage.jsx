import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { postKeys } from "../../api/query-keys.js";
import useAuth from "../../auth/useAuth.js";
import AdminPostRow from "../../components/admin/AdminPostRow.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Pagination from "../../components/Pagination.jsx";
import StatusMessage from "../../components/StatusMessage.jsx";
import useDebouncedValue from "../../hooks/useDebouncedValue.js";
import {
  readPostFilters,
  toPostFilterParams,
} from "../../utils/post-filters.js";

const PAGE_SIZE = 10;
const SEARCH_DELAY = 400;

const STATUS_FILTERS = [
  { value: null, label: "Tümü" },
  { value: "draft", label: "Taslaklar" },
  { value: "published", label: "Yayında" },
];

function buildPostsPath({
  search,
  status,
  showDeleted,
  categoryId,
  userId,
  page,
}) {
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

  if (categoryId !== null) {
    params.set("category_id", String(categoryId));
  }

  if (userId !== null) {
    params.set("user_id", String(userId));
  }

  return `/api/v1/posts?${params}`;
}

function describeScope({ categoryId, userId }, firstPost) {
  const parts = [];

  if (categoryId !== null) {
    parts.push(`Kategori: ${firstPost?.category.name ?? `#${categoryId}`}`);
  }

  if (userId !== null) {
    parts.push(`Yazar: ${firstPost?.author.name ?? `#${userId}`}`);
  }

  return parts.join(" · ");
}

export default function AdminPostsPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filters = readPostFilters(searchParams);
  const { status, showDeleted, categoryId, userId, page } = filters;
  const hasScope = categoryId !== null || userId !== null;

  const debouncedSearch = useDebouncedValue(
    search.trim(),
    SEARCH_DELAY
  );

  const listFilters = { ...filters, search: debouncedSearch };

  const postsQuery = useQuery({
    queryKey: postKeys.list(listFilters),
    queryFn: ({ signal }) =>
      auth.authRequest(buildPostsPath(listFilters), { signal }),
    placeholderData: keepPreviousData,
  });

  const posts = postsQuery.data?.data;
  const meta = postsQuery.data?.meta;

  function updateFilters(changes) {
    setSearchParams(toPostFilterParams({ ...filters, ...changes }));
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);

    if (page !== 1) {
      updateFilters({ page: 1 });
    }
  }

  function handleStatusChange(nextStatus) {
    updateFilters({ status: nextStatus, page: 1 });
  }

  function handleShowDeletedChange(event) {
    updateFilters({ showDeleted: event.target.checked, page: 1 });
  }

  function clearScope() {
    updateFilters({ categoryId: null, userId: null, page: 1 });
  }

  function handlePageChange(nextPage) {
    updateFilters({ page: nextPage });
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
      await queryClient.invalidateQueries({ queryKey: postKeys.all });
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
      await queryClient.invalidateQueries({ queryKey: postKeys.all });
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

      {hasScope && (
        <p className="filter-note">
          {describeScope(filters, posts?.[0])}
          <button
            type="button"
            className="link-button"
            onClick={clearScope}
          >
            Süzgeci kaldır
          </button>
        </p>
      )}

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {actionError && (
        <StatusMessage type="error">{actionError.message}</StatusMessage>
      )}

      {postsQuery.isPending && (
        <StatusMessage>Yazılar yükleniyor...</StatusMessage>
      )}

      {postsQuery.error && (
        <StatusMessage type="error">{postsQuery.error.message}</StatusMessage>
      )}

      {posts?.length === 0 && (
        <StatusMessage>Bu listede yazı yok.</StatusMessage>
      )}

      {posts?.length > 0 && (
        <>
          <table
            className="post-table"
            aria-busy={postsQuery.isPlaceholderData}
          >
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
              {posts.map((post) => (
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
            totalPages={meta.total_pages}
            onPageChange={handlePageChange}
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
