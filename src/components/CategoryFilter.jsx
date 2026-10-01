import useApi from "../hooks/useApi.js";

export default function CategoryFilter({
  selectedId,
  onSelect,
}) {
  const categories = useApi(
    "/api/v1/public/categories"
  );

  if (!categories.data) {
    return null;
  }

  const visibleCategories = categories.data.filter(
    (category) => category.published_post_count > 0
  );

  return (
    <nav
      className="category-filter"
      aria-label="Kategoriler"
    >
      <button
        type="button"
        className="chip"
        aria-pressed={selectedId === null}
        onClick={() => onSelect(null)}
      >
        Tümü
      </button>

      {visibleCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="chip"
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name} ({category.published_post_count})
        </button>
      ))}
    </nav>
  );
}
