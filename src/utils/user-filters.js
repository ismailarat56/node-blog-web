import { parsePositiveInt } from "./parse-positive-int.js";

const SORT_FIELDS = ["name", "email", "created_at"];
const DEFAULT_SORT = { by: "created_at", order: "desc" };

export function readUserFilters(searchParams) {
  const active = searchParams.get("active");
  const sortBy = searchParams.get("sort");

  return {
    active: active === "1" || active === "0" ? Number(active) : null,
    showDeleted: searchParams.get("deleted") === "1",
    sort: {
      by: SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULT_SORT.by,
      order: searchParams.get("order") === "asc" ? "asc" : "desc",
    },
    page: parsePositiveInt(searchParams.get("page")) ?? 1,
  };
}

export function toUserFilterParams(filters) {
  const params = new URLSearchParams();

  if (filters.active !== null) {
    params.set("active", String(filters.active));
  }

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

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params;
}
