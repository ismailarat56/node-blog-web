export default function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Sayfalar">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Önceki
      </button>

      <span>
        Sayfa {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sonraki →
      </button>
    </nav>
  );
}
