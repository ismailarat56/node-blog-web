export const EMPTY_POST = {
  title: "",
  excerpt: "",
  content: "",
  category_id: "",
};

export function toFormValues(post) {
  return {
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    category_id: String(post.category.id),
  };
}

export function toPostPayload(values) {
  const payload = { ...values };

  if ("category_id" in payload) {
    payload.category_id =
      Number(payload.category_id) || null;
  }

  return payload;
}
