import { parsePositiveInt } from "./parse-positive-int.js";

const STATUSES = ["draft", "published"];

export function readPostFilters(searchParams) {
  const status = searchParams.get("status");

  return {
    status: STATUSES.includes(status) ? status : null,
    showDeleted: searchParams.get("deleted") === "1",
    categoryId: parsePositiveInt(searchParams.get("category")),
    userId: parsePositiveInt(searchParams.get("user")),
    page: parsePositiveInt(searchParams.get("page")) ?? 1,
  };
}

export function toPostFilterParams(filters) {
  const params = new URLSearchParams();

  if (filters.status !== null) {
    params.set("status", filters.status);
  }

  if (filters.showDeleted) {
    params.set("deleted", "1");
  }

  if (filters.categoryId !== null) {
    params.set("category", String(filters.categoryId));
  }

  if (filters.userId !== null) {
    params.set("user", String(filters.userId));
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params;
}
