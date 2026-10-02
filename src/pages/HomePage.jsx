import { useSearchParams } from "react-router";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../components/Pagination.jsx";
import PostList from "../components/PostList.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useApi from "../hooks/useApi.js";
import { parsePositiveInt } from "../utils/parse-positive-int.js";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = parsePositiveInt(
    searchParams.get("category")
  );
  const page =
    parsePositiveInt(searchParams.get("page")) ?? 1;

  const posts = useApi(
    buildPostsPath(categoryId, page)
  );

  const isPageMissing =
    posts.meta !== null &&
    posts.meta.total_pages > 0 &&
    page > posts.meta.total_pages;

  function updateFilters(nextCategoryId, nextPage) {
    const nextParams = new URLSearchParams();

    if (nextCategoryId !== null) {
      nextParams.set("category", String(nextCategoryId));
    }

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
  }

  function handleCategorySelect(nextCategoryId) {
    updateFilters(nextCategoryId, 1);
  }

  function handlePageChange(nextPage) {
    updateFilters(categoryId, nextPage);
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

      {posts.data && isPageMissing && (
        <StatusMessage>
          Bu sayfa yok.{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => handlePageChange(1)}
          >
            İlk sayfaya dön
          </button>
        </StatusMessage>
      )}

      {posts.data && !isPageMissing && (
        <>
          <PostList posts={posts.data} />

          <Pagination
            page={page}
            totalPages={posts.meta.total_pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
