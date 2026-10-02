import { useState } from "react";
import useAuth from "../auth/useAuth.js";
import useApi from "../hooks/useApi.js";
import { formatDate } from "../utils/format-date.js";
import StatusMessage from "./StatusMessage.jsx";

function flattenComments(comments) {
  return comments.flatMap((comment) => [
    comment,
    ...(comment.replies ?? []),
  ]);
}

export default function CommentModeration({ postId }) {
  const auth = useAuth();

  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  const comments = useApi(
    `/api/v1/posts/${postId}/comments?include_hidden=1&limit=50`,
    auth.authRequest
  );

  async function changeComment(comment, method, suffix = "") {
    setBusyId(comment.id);
    setError(null);

    try {
      await auth.authRequest(
        `/api/v1/comments/${comment.id}${suffix}`,
        { method }
      );
    } catch (actionError) {
      setError(actionError);
    } finally {
      setBusyId(null);
      comments.reload();
    }
  }

  function handleDelete(comment) {
    if (window.confirm("Bu yorum silinsin mi?")) {
      changeComment(comment, "DELETE");
    }
  }

  return (
    <section className="editor__section">
      <h2>Yorumlar</h2>

      <p className="form__hint">
        Gizlediğin yorumu yalnız sen ve yönetici görürsünüz.
        Okuyucular, yorumu yazan kişi bile, göremez.
      </p>

      {comments.loading && (
        <StatusMessage>Yorumlar yükleniyor...</StatusMessage>
      )}

      {comments.error && (
        <StatusMessage type="error">
          {comments.error.message}
        </StatusMessage>
      )}

      {error && (
        <StatusMessage type="error">{error.message}</StatusMessage>
      )}

      {comments.data?.length === 0 && (
        <StatusMessage>Bu yazıya henüz yorum yapılmamış.</StatusMessage>
      )}

      {comments.data?.length > 0 && (
        <ul className="moderation-list">
          {flattenComments(comments.data).map((comment) => {
            const isHidden = comment.status === "hidden";
            const className = [
              "moderation-item",
              comment.parent_id !== null &&
                "moderation-item--reply",
              isHidden && "moderation-item--hidden",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={comment.id} className={className}>
                <p className="comment__meta">
                  <strong>{comment.author.name}</strong> ·{" "}
                  {formatDate(comment.created_at)}{" "}
                  {isHidden && (
                    <span className="badge badge--hidden">
                      Gizli
                    </span>
                  )}
                </p>

                <p className="comment__body">{comment.body}</p>

                <div className="comment__actions">
                  <button
                    type="button"
                    className="link-button"
                    disabled={busyId === comment.id}
                    onClick={() =>
                      changeComment(
                        comment,
                        "PATCH",
                        isHidden ? "/unhide" : "/hide"
                      )
                    }
                  >
                    {isHidden ? "Göster" : "Gizle"}
                  </button>

                  <button
                    type="button"
                    className="link-button link-button--danger"
                    disabled={busyId === comment.id}
                    onClick={() => handleDelete(comment)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
