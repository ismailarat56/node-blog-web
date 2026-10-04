export function getCategoryStatus(category) {
  if (category.deleted_at !== null) {
    return { key: "deleted", label: "Silindi" };
  }

  if (category.is_active === 1) {
    return { key: "active", label: "Aktif" };
  }

  return { key: "inactive", label: "Pasif" };
}
