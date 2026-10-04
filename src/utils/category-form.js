export const EMPTY_CATEGORY = {
  name: "",
  slug: "",
  description: "",
};

export function toCategoryFormValues(category) {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
  };
}
