import { useState } from "react";
import useAuth from "../auth/useAuth.js";
import { formatDate } from "../utils/format-date.js";
import CommentForm from "./CommentForm.jsx";
import StatusMessage from "./StatusMessage.jsx";

export default function CommentItem({
  comment,
  postId,
  onChange,
  isReply = false,
}) {
  const auth = useAuth();

  const [isReplying, setIsReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const replies = comment.replies ?? [];
  const isSignedIn = auth.status === "authenticated";
  const canReply = isSignedIn && !isReply;
  const canDelete =
    isSignedIn &&
    (auth.user.id === comment.author.id ||
      auth.user.role === "admin");

  function handleReplyCreated() {
    setIsReplying(false);
    onChange();
  }

  async function handleDelete() {
    if (!window.confirm("Bu yorum silinsin mi?")) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await auth.authRequest(
        `/api/v1/comments/${comment.id}`,
        { method: "DELETE" }
      );

      onChange();
    } catch (deleteError) {
      setError(deleteError);
      setDeleting(false);
    }
  }

  return (
    <li className="comment">
      <p className="comment__meta">
        <strong>{comment.author.name}</strong> ·{" "}
        {formatDate(comment.created_at)}
        {comment.edited_at && " · düzenlendi"}
      </p>

      <p className="comment__body">{comment.body}</p>

      {(canReply || canDelete) && (
        <div className="comment__actions">
          {canReply && (
            <button
              type="button"
              className="link-button"
              disabled={isReplying}
              onClick={() => setIsReplying(true)}
            >
              Cevapla
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              className="link-button"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Siliniyor..." : "Sil"}
            </button>
          )}
        </div>
      )}

      {error && (
        <StatusMessage type="error">
          {error.message}
        </StatusMessage>
      )}

      {isReplying && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          onCreated={handleReplyCreated}
          onCancel={() => setIsReplying(false)}
        />
      )}

      {replies.length > 0 && (
        <ul className="comment-list comment-list--replies">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onChange={onChange}
              isReply
            />
          ))}
        </ul>
      )}
    </li>
  );
}
