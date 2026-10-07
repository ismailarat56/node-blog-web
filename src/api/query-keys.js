export const userKeys = {
  all: ["users"],
  lists: ["users", "list"],
  list: (filters) => ["users", "list", filters],
  detail: (id) => ["users", "detail", id],
};

export const categoryKeys = {
  all: ["categories"],
  list: (filters) => ["categories", "list", filters],
};

export const postKeys = {
  all: ["posts"],
  list: (filters) => ["posts", "list", filters],
};
