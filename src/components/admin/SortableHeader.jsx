export default function SortableHeader({
  label,
  field,
  sort,
  onSort,
}) {
  const active = sort.by === field;
  let ariaSort = "none";

  if (active) {
    ariaSort = sort.order === "asc" ? "ascending" : "descending";
  }

  return (
    <th aria-sort={ariaSort}>
      <button
        type="button"
        className="sort-button"
        onClick={() => onSort(field)}
      >
        {label}
        {active && (sort.order === "asc" ? " ↑" : " ↓")}
      </button>
    </th>
  );
}
