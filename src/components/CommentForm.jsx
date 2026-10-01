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
  onCreated,
  onCancel,
}) {
  const auth = useAuth();
  const id = useId();

  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const text = body.trim();
  const remaining = MAX_LENGTH - body.length;
  const canSubmit = text.length > 0 && !submitting;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload =
      parentId === null
        ? { body: text }
        : { body: text, parent_id: parentId };

    try {
      await auth.authRequest(
        `/api/v1/posts/${postId}/comments`,
        { method: "POST", body: payload }
      );

      setBody("");
      onCreated();
    } catch (commentError) {
      setError(commentError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form comment-form" onSubmit={handleSubmit}>
      <div className="form__field">
        <label htmlFor={id}>
          {parentId === null ? "Yorumun" : "Cevabın"}
        </label>

        <textarea
          id={id}
          rows={parentId === null ? 4 : 3}
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
          {submitting ? "Gönderiliyor..." : "Gönder"}
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
