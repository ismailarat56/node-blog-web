const SORT_FIELDS = ["name", "slug", "created_at"];
const DEFAULT_SORT = { by: "name", order: "asc" };

export function readCategoryFilters(searchParams) {
  const sortBy = searchParams.get("sort");

  return {
    showDeleted: searchParams.get("deleted") === "1",
    sort: {
      by: SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULT_SORT.by,
      order: searchParams.get("order") === "desc" ? "desc" : "asc",
    },
  };
}

export function toCategoryFilterParams(filters) {
  const params = new URLSearchParams();

  if (filters.showDeleted) {
    params.set("deleted", "1");
  }

  if (
    filters.sort.by !== DEFAULT_SORT.by ||
    filters.sort.order !== DEFAULT_SORT.order
  ) {
    params.set("sort", filters.sort.by);
    params.set("order", filters.sort.order);
  }

  return params;
}
