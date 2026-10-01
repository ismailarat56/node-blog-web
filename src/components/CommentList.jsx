import { Link, useLocation } from "react-router";
import useAuth from "../auth/useAuth.js";
import useApi from "../hooks/useApi.js";
import CommentForm from "./CommentForm.jsx";
import CommentItem from "./CommentItem.jsx";
import StatusMessage from "./StatusMessage.jsx";

export default function CommentList({ slug, postId }) {
  const auth = useAuth();
  const location = useLocation();

  const comments = useApi(
    `/api/v1/public/posts/${encodeURIComponent(slug)}/comments`
  );

  return (
    <section className="comments">
      <h2>Yorumlar</h2>

      {auth.status === "authenticated" && (
        <CommentForm
          postId={postId}
          onCreated={comments.reload}
        />
      )}

      {auth.status === "anonymous" && (
        <p>
          Yorum yazmak için{" "}
          <Link to="/login" state={{ from: location }}>
            giriş yap
          </Link>
          .
        </p>
      )}

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
              postId={postId}
              onChange={comments.reload}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
