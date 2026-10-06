import { useState } from "react";
import useAuth from "../../auth/useAuth.js";
import SortableHeader from "../../components/admin/SortableHeader.jsx";
import UserRow from "../../components/admin/UserRow.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Pagination from "../../components/Pagination.jsx";
import StatusMessage from "../../components/StatusMessage.jsx";
import useApi from "../../hooks/useApi.js";
import useDebouncedValue from "../../hooks/useDebouncedValue.js";

const PAGE_SIZE = 20;
const SEARCH_DELAY = 400;

const ACTIVE_FILTERS = [
  { value: null, label: "Tümü" },
  { value: 1, label: "Aktif" },
  { value: 0, label: "Pasif" },
];

function buildUsersPath({
  search,
  active,
  showDeleted,
  sort,
  page,
}) {
  const params = new URLSearchParams({
    sort_by: sort.by,
    sort_order: sort.order,
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  if (search !== "") {
    params.set("search", search);
  }

  if (active !== null) {
    params.set("is_active", String(active));
  }

  if (showDeleted) {
    params.set("include_deleted", "1");
  }

  return `/api/v1/users?${params}`;
}

function describeChange({ user, field, value }) {
  if (field === "deleted") {
    return {
      title: "Kullanıcıyı sil",
      text: `${user.name} giriş yapamayacak ve listeden çıkacak. Yazıları ve yorumları yerinde kalır. "Silinenleri göster" ile geri getirebilirsin.`,
      confirmLabel: "Sil",
      danger: true,
    };
  }

  if (field === "role" && value === "admin") {
    return {
      title: "Yönetici yap",
      text: `${user.name} kategorileri, bütün yazıları ve kullanıcıları yönetebilecek.`,
    };
  }

  if (field === "role") {
    return {
      title: "Yöneticilikten çıkar",
      text: `${user.name} yönetim paneline erişemeyecek.`,
    };
  }

  if (value === 0) {
    return {
      title: "Hesabı pasifleştir",
      text: `${user.name} giriş yapamayacak; açık oturumları bir sonraki istekte kapanacak.`,
    };
  }

  return {
    title: "Hesabı aktifleştir",
    text: `${user.name} yeniden giriş yapabilecek.`,
  };
}

function buildChangeRequest({ user, field, value }) {
  if (field === "deleted") {
    return {
      method: "DELETE",
      path: `/api/v1/users/${user.id}`,
    };
  }

  if (field === "role") {
    return {
      method: "PATCH",
      path: `/api/v1/users/${user.id}/role`,
      body: { role: value },
    };
  }

  return {
    method: "PATCH",
    path: `/api/v1/users/${user.id}`,
    body: { is_active: value },
  };
}

export default function AdminUsersPage() {
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [sort, setSort] = useState({ by: "created_at", order: "desc" });
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [pendingChange, setPendingChange] = useState(null);
  const [changeError, setChangeError] = useState(null);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebouncedValue(
    search.trim(),
    SEARCH_DELAY
  );

  const users = useApi(
    buildUsersPath({
      search: debouncedSearch,
      active,
      showDeleted,
      sort,
      page,
    }),
    auth.authRequest
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleActiveChange(nextActive) {
    setActive(nextActive);
    setPage(1);
  }

  function handleShowDeletedChange(event) {
    setShowDeleted(event.target.checked);
    setPage(1);
  }

  function handleSort(field) {
    setPage(1);
    setSort((current) => {
      if (current.by !== field) {
        return { by: field, order: "asc" };
      }

      return {
        by: field,
        order: current.order === "asc" ? "desc" : "asc",
      };
    });
  }

  function askChange(change) {
    setNotice(null);
    setActionError(null);
    setChangeError(null);
    setPendingChange(change);
  }

  function closeDialog() {
    setPendingChange(null);
    setChangeError(null);
  }

  async function handleConfirm() {
    const { user } = pendingChange;
    const { method, path, body } =
      buildChangeRequest(pendingChange);

    setSaving(true);
    setChangeError(null);

    try {
      const { message } = await auth.authRequest(path, {
        method,
        body,
      });

      setNotice(`${user.name}: ${message}`);
      setPendingChange(null);
      users.reload();
    } catch (saveError) {
      setChangeError(saveError);
    } finally {
      setSaving(false);
    }
  }

  async function handleRestore(user) {
    setNotice(null);
    setActionError(null);

    try {
      const { message } = await auth.authRequest(
        `/api/v1/users/${user.id}/restore`,
        { method: "PATCH" }
      );

      setNotice(`${user.name}: ${message}`);
      users.reload();
    } catch (restoreError) {
      setActionError(restoreError);
    }
  }

  const dialog = pendingChange ? describeChange(pendingChange) : null;

  return (
    <section>
      <title>Kullanıcılar · Yönetim · Node Blog</title>
      <h1 className="page-title">Kullanıcılar</h1>

      <div className="toolbar">
        <input
          type="search"
          aria-label="Kullanıcı ara"
          placeholder="Ad veya e-posta"
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

        {users.meta && (
          <span className="form__hint">{users.meta.total} kullanıcı</span>
        )}
      </div>

      <nav className="category-filter" aria-label="Durum">
        {ACTIVE_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className="chip"
            aria-pressed={active === filter.value}
            onClick={() => handleActiveChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {actionError && (
        <StatusMessage type="error">{actionError.message}</StatusMessage>
      )}

      {users.loading && (
        <StatusMessage>Kullanıcılar yükleniyor...</StatusMessage>
      )}

      {users.error && (
        <StatusMessage type="error">{users.error.message}</StatusMessage>
      )}

      {users.data?.length === 0 && (
        <StatusMessage>Bu listede kullanıcı yok.</StatusMessage>
      )}

      {users.data?.length > 0 && (
        <>
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
                  label="E-posta"
                  field="email"
                  sort={sort}
                  onSort={handleSort}
                />
                <th>Rol</th>
                <th>Durum</th>
                <SortableHeader
                  label="Kayıt"
                  field="created_at"
                  sort={sort}
                  onSort={handleSort}
                />
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {users.data.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelf={user.id === auth.user.id}
                  onChange={askChange}
                  onRestore={handleRestore}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={users.meta.total_pages}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={pendingChange !== null}
        title={dialog?.title}
        confirmLabel={dialog?.confirmLabel ?? "Onayla"}
        danger={dialog?.danger}
        busy={saving}
        onConfirm={handleConfirm}
        onClose={closeDialog}
      >
        <p>{dialog?.text}</p>

        {changeError && (
          <StatusMessage type="error">{changeError.message}</StatusMessage>
        )}
      </ConfirmDialog>
    </section>
  );
}
