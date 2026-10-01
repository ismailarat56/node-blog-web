import useApi from "../hooks/useApi.js";
import CommentItem from "./CommentItem.jsx";
import StatusMessage from "./StatusMessage.jsx";

export default function CommentList({ slug }) {
  const comments = useApi(
    `/api/v1/public/posts/${encodeURIComponent(slug)}/comments`
  );

  return (
    <section className="comments">
      <h2>Yorumlar</h2>

      {comments.loading && (
        <StatusMessage>Yorumlar yükleniyor...</StatusMessage>
      )}

      {comments.error && (
        <StatusMessage type="error">
          {comments.error.message}
        </StatusMessage>
      )}

      {comments.data?.length === 0 && (
        <StatusMessage>Henüz yorum yok.</StatusMessage>
      )}

      {comments.data?.length > 0 && (
        <ul className="comment-list">
          {comments.data.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
