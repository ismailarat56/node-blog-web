import { Link } from "react-router";
import { formatDate } from "../utils/format-date.js";
import LikeButton from "./LikeButton.jsx";

export default function PostCard({ post }) {
  const postUrl = `/posts/${post.slug}`;

  return (
    <article className="post-card">
      {post.cover_url ? (
        <img
          className="post-card__cover"
          src={post.cover_url}
          alt=""
          loading="lazy"
        />
      ) : (
        <div className="post-card__cover post-card__cover--empty">
          {post.category.name}
        </div>
      )}

      <div className="post-card__body">
        <p className="post-card__meta">
          {post.category.name} ·{" "}
          {formatDate(post.published_at)}
        </p>

        <h2 className="post-card__title">
          <Link to={postUrl}>{post.title}</Link>
        </h2>

        {post.excerpt && (
          <p className="post-card__excerpt">
            {post.excerpt}
          </p>
        )}

        <div className="post-card__footer">
          <span>{post.author.name}</span>

          {post.comment_count > 0 && (
            <span>{post.comment_count} yorum</span>
          )}

          <LikeButton />
        </div>
      </div>
    </article>
  );
}
