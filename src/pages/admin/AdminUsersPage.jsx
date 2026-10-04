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

function buildUsersPath({ search, active, sort, page }) {
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

  return `/api/v1/users?${params}`;
}

function describeChange({ user, field, value }) {
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
  if (field === "role") {
    return {
      path: `/api/v1/users/${user.id}/role`,
      body: { role: value },
    };
  }

  return {
    path: `/api/v1/users/${user.id}`,
    body: { is_active: value },
  };
}

export default function AdminUsersPage() {
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);
  const [sort, setSort] = useState({ by: "created_at", order: "desc" });
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(null);
  const [pendingChange, setPendingChange] = useState(null);
  const [changeError, setChangeError] = useState(null);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebouncedValue(
    search.trim(),
    SEARCH_DELAY
  );

  const users = useApi(
    buildUsersPath({ search: debouncedSearch, active, sort, page }),
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
    setChangeError(null);
    setPendingChange(change);
  }

  function closeDialog() {
    setPendingChange(null);
    setChangeError(null);
  }

  async function handleConfirm() {
    const { user } = pendingChange;
    const { path, body } = buildChangeRequest(pendingChange);

    setSaving(true);
    setChangeError(null);

    try {
      const { message } = await auth.authRequest(path, {
        method: "PATCH",
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
        confirmLabel="Onayla"
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
