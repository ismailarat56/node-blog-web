import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { categoryKeys, postKeys } from "../../api/query-keys.js";
import useAuth from "../../auth/useAuth.js";
import CategoryForm from "../../components/admin/CategoryForm.jsx";
import CategoryRow from "../../components/admin/CategoryRow.jsx";
import SortableHeader from "../../components/admin/SortableHeader.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import StatusMessage from "../../components/StatusMessage.jsx";
import useDebouncedValue from "../../hooks/useDebouncedValue.js";
import {
  readCategoryFilters,
  toCategoryFilterParams,
} from "../../utils/category-filters.js";
import {
  EMPTY_CATEGORY,
  toCategoryFormValues,
} from "../../utils/category-form.js";

const PAGE_SIZE = 50;
const SEARCH_DELAY = 400;

function describeDeleteError(error) {
  if (error.code === "CATEGORY_HAS_POSTS") {
    return `Bu kategoride ${error.details.active_posts} yazı var. Önce yazıları başka bir kategoriye taşı veya sil.`;
  }

  return error.message;
}

function buildCategoriesPath(search, showDeleted, sort) {
  const params = new URLSearchParams({
    sort_by: sort.by,
    sort_order: sort.order,
    limit: String(PAGE_SIZE),
  });

  if (search !== "") {
    params.set("search", search);
  }

  if (showDeleted) {
    params.set("include_deleted", "1");
  }

  return `/api/v1/categories?${params}`;
}

export default function AdminCategoriesPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filters = readCategoryFilters(searchParams);
  const { showDeleted, sort } = filters;

  const debouncedSearch = useDebouncedValue(
    search.trim(),
    SEARCH_DELAY
  );

  const listFilters = { ...filters, search: debouncedSearch };

  const categoriesQuery = useQuery({
    queryKey: categoryKeys.list(listFilters),
    queryFn: ({ signal }) =>
      auth.authRequest(
        buildCategoriesPath(debouncedSearch, showDeleted, sort),
        { signal }
      ),
  });

  const categories = categoriesQuery.data?.data;
  const meta = categoriesQuery.data?.meta;

  function refreshCategories() {
    return queryClient.invalidateQueries({ queryKey: categoryKeys.all });
  }

  function openNewForm() {
    setNotice(null);
    setEditing("new");
  }

  function openEditForm(category) {
    setNotice(null);
    setEditing(category);
  }

  async function handleCreate(values) {
    const { data } = await auth.authRequest("/api/v1/categories", {
      method: "POST",
      body: values,
    });

    setEditing(null);
    setNotice(`"${data.name}" oluşturuldu.`);
    await refreshCategories();
  }

  async function handleUpdate(values, changes) {
    const { data } = await auth.authRequest(
      `/api/v1/categories/${editing.id}`,
      { method: "PATCH", body: changes }
    );

    setEditing(null);
    setNotice(`"${data.name}" güncellendi.`);
    await queryClient.invalidateQueries({ queryKey: postKeys.all });
    await refreshCategories();
  }

  async function handleToggleActive(category, nextActive) {
    setActionError(null);

    try {
      const { data } = await auth.authRequest(
        `/api/v1/categories/${category.id}`,
        { method: "PATCH", body: { is_active: nextActive } }
      );

      queryClient.setQueryData(
        categoryKeys.list(listFilters),
        (current) => ({
          ...current,
          data: current.data.map((item) =>
            item.id === data.id ? data : item
          ),
        })
      );
    } catch (toggleError) {
      setActionError(toggleError);
    }
  }

  function askDelete(category) {
    setNotice(null);
    setDeleteError(null);
    setDeleteTarget(category);
  }

  function closeDeleteDialog() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);

    try {
      await auth.authRequest(
        `/api/v1/categories/${deleteTarget.id}`,
        { method: "DELETE" }
      );

      setNotice(`"${deleteTarget.name}" silindi.`);
      setDeleteTarget(null);
      await refreshCategories();
    } catch (deleteFailure) {
      setDeleteError(deleteFailure);
    } finally {
      setDeleting(false);
    }
  }

  async function handleRestore(category) {
    setNotice(null);
    setActionError(null);

    try {
      await auth.authRequest(
        `/api/v1/categories/${category.id}/restore`,
        { method: "PATCH" }
      );

      setNotice(`"${category.name}" geri getirildi.`);
      await refreshCategories();
    } catch (restoreError) {
      setActionError(restoreError);
    }
  }

  function updateFilters(changes) {
    setSearchParams(toCategoryFilterParams({ ...filters, ...changes }));
  }

  function handleShowDeletedChange(event) {
    updateFilters({ showDeleted: event.target.checked });
  }

  function handleSort(field) {
    const nextSort =
      sort.by === field
        ? { by: field, order: sort.order === "asc" ? "desc" : "asc" }
        : { by: field, order: "asc" };

    updateFilters({ sort: nextSort });
  }

  return (
    <section>
      <title>Kategoriler · Yönetim · Node Blog</title>
      <div className="dashboard__header">
        <h1 className="page-title">Kategoriler</h1>

        <button type="button" className="button" onClick={openNewForm}>
          Yeni kategori
        </button>
      </div>

      {editing === "new" && (
        <div className="admin-panel">
          <h2>Yeni kategori</h2>
          <CategoryForm
            initialValues={EMPTY_CATEGORY}
            submitLabel="Oluştur"
            onSubmit={handleCreate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {editing !== null && editing !== "new" && (
        <div className="admin-panel">
          <h2>Düzenle: {editing.name}</h2>
          <CategoryForm
            key={editing.id}
            initialValues={toCategoryFormValues(editing)}
            submitLabel="Kaydet"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {actionError && (
        <StatusMessage type="error">{actionError.message}</StatusMessage>
      )}

      <div className="toolbar">
        <input
          type="search"
          aria-label="Kategori ara"
          placeholder="Ad, slug veya açıklama"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeletedChange}
          />
          Silinenleri göster
        </label>

        {meta && (
          <span className="form__hint">{meta.total} kategori</span>
        )}

        {categoriesQuery.isFetching && !categoriesQuery.isPending && (
          <span className="fetch-note">Güncelleniyor...</span>
        )}
      </div>

      {categoriesQuery.isPending && (
        <StatusMessage>Kategoriler yükleniyor...</StatusMessage>
      )}

      {categoriesQuery.error && (
        <StatusMessage type="error">
          {categoriesQuery.error.message}
        </StatusMessage>
      )}

      {categories?.length === 0 && (
        <StatusMessage>
          {debouncedSearch === ""
            ? "Bu listede kategori yok."
            : `"${debouncedSearch}" ile eşleşen kategori yok.`}
        </StatusMessage>
      )}

      {categories?.length > 0 && (
        <table className="post-table">
          <thead>
            <tr>
              <SortableHeader
                label="Ad"
                field="name"
                sort={sort}
                onSort={handleSort}
              />
              <SortableHeader
                label="Slug"
                field="slug"
                sort={sort}
                onSort={handleSort}
              />
              <th>Durum</th>
              <SortableHeader
                label="Oluşturma"
                field="created_at"
                sort={sort}
                onSort={handleSort}
              />
              <th>İşlem</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={openEditForm}
                onToggleActive={handleToggleActive}
                onDelete={askDelete}
                onRestore={handleRestore}
              />
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Kategoriyi sil"
        confirmLabel="Sil"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onClose={closeDeleteDialog}
      >
        <p>
          "{deleteTarget?.name}" silinecek. Listede "Silindi" olarak
          kalır ve geri getirilebilir; slug'ı yeni bir kategoride
          kullanılamaz.
        </p>

        {deleteError && (
          <StatusMessage type="error">
            {describeDeleteError(deleteError)}
          </StatusMessage>
        )}
      </ConfirmDialog>
    </section>
  );
}
