import { Link, useParams } from "react-router";
import CommentList from "../components/CommentList.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useApi from "../hooks/useApi.js";
import { formatDate } from "../utils/format-date.js";

export default function PostDetailPage() {
  const { slug } = useParams();

  const post = useApi(
    `/api/v1/public/posts/${encodeURIComponent(slug)}`
  );

  if (post.loading) {
    return <StatusMessage>Yazı yükleniyor...</StatusMessage>;
  }

  if (post.error?.code === "POST_NOT_FOUND") {
    return (
      <StatusMessage type="error">
        Bu yazı bulunamadı.{" "}
        <Link to="/">Ana sayfaya dön</Link>
      </StatusMessage>
    );
  }

  if (post.error) {
    return (
      <StatusMessage type="error">
        {post.error.message}
      </StatusMessage>
    );
  }

  const {
    title,
    content,
    cover_url: coverUrl,
    published_at: publishedAt,
    author,
    category,
  } = post.data;

  return (
    <article className="post-detail">
      <title>{`${title} · Node Blog`}</title>

      <Link to="/" className="back-link">
        ← Tüm yazılar
      </Link>

      <p className="post-detail__meta">
        {category.name} · {formatDate(publishedAt)} ·{" "}
        {author.name}
      </p>

      <h1 className="post-detail__title">{title}</h1>

      {coverUrl && (
        <img
          className="post-detail__cover"
          src={coverUrl}
          alt=""
        />
      )}

      <div className="post-detail__content">{content}</div>

      <CommentList slug={slug} />
    </article>
  );
}
