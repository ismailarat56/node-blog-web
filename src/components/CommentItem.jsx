import { formatDate } from "../utils/format-date.js";

export default function CommentItem({ comment }) {
  const replies = comment.replies ?? [];

  return (
    <li className="comment">
      <p className="comment__meta">
        <strong>{comment.author.name}</strong> ·{" "}
        {formatDate(comment.created_at)}
        {comment.edited_at && " · düzenlendi"}
      </p>

      <p className="comment__body">{comment.body}</p>

      {replies.length > 0 && (
        <ul className="comment-list comment-list--replies">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </ul>
      )}
    </li>
  );
}
