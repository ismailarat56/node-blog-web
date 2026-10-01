import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../components/Pagination.jsx";
import PostList from "../components/PostList.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useApi from "../hooks/useApi.js";

const PAGE_SIZE = 4;

function buildPostsPath(categoryId, page) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  if (categoryId !== null) {
    params.set("category_id", String(categoryId));
  }

  return `/api/v1/public/posts?${params}`;
}

export default function HomePage() {
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);

  const posts = useApi(
    buildPostsPath(categoryId, page)
  );

  function handleCategorySelect(nextCategoryId) {
    setCategoryId(nextCategoryId);
    setPage(1);
  }

  return (
    <section>
      <h1 className="page-title">Son Yazılar</h1>

      <CategoryFilter
        selectedId={categoryId}
        onSelect={handleCategorySelect}
      />

      {posts.loading && (
        <StatusMessage>Yazılar yükleniyor...</StatusMessage>
      )}

      {posts.error && (
        <StatusMessage type="error">
          {posts.error.message}
        </StatusMessage>
      )}

      {posts.data && (
        <>
          <PostList posts={posts.data} />

          <Pagination
            page={page}
            totalPages={posts.meta.total_pages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
