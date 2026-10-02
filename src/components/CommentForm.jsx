import { useId, useState } from "react";
import useAuth from "../auth/useAuth.js";
import StatusMessage from "./StatusMessage.jsx";

const MAX_LENGTH = 2000;

function describeCommentError(error) {
  if (error.code === "RATE_LIMITED") {
    return `Çok hızlı yorum gönderiyorsun. ${error.retryAfter ?? 60} saniye sonra tekrar dene.`;
  }

  return error.message;
}

export default function CommentForm({
  postId,
  parentId = null,
  comment = null,
  onSaved,
  onCancel,
}) {
  const auth = useAuth();
  const id = useId();

  const isEditing = comment !== null;

  const [body, setBody] = useState(comment?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const text = body.trim();
  const remaining = MAX_LENGTH - body.length;
  const isUnchanged = isEditing && text === comment.body;
  const canSubmit =
    text.length > 0 && !isUnchanged && !submitting;

  const submitLabel = isEditing ? "Kaydet" : "Gönder";

  let label = "Yorumun";

  if (isEditing) {
    label = "Yorumunu düzenle";
  } else if (parentId !== null) {
    label = "Cevabın";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await auth.authRequest(`/api/v1/comments/${comment.id}`, {
          method: "PATCH",
          body: { body: text },
        });
      } else {
        const payload =
          parentId === null
            ? { body: text }
            : { body: text, parent_id: parentId };

        await auth.authRequest(
          `/api/v1/posts/${postId}/comments`,
          { method: "POST", body: payload }
        );

        setBody("");
      }

      onSaved();
    } catch (commentError) {
      setError(commentError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form comment-form" onSubmit={handleSubmit}>
      <div className="form__field">
        <label htmlFor={id}>{label}</label>

        <textarea
          id={id}
          rows={parentId === null && !isEditing ? 4 : 3}
          maxLength={MAX_LENGTH}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />

        <p className="form__hint">{remaining} karakter kaldı</p>
      </div>

      {error && (
        <StatusMessage type="error">
          {describeCommentError(error)}
        </StatusMessage>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="button"
          disabled={!canSubmit}
        >
          {submitting ? "Gönderiliyor..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            className="link-button"
            onClick={onCancel}
          >
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
