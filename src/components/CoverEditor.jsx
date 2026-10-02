import { useEffect, useRef, useState } from "react";
import useAuth from "../auth/useAuth.js";
import FormField from "./FormField.jsx";
import StatusMessage from "./StatusMessage.jsx";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function checkFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Yalnız JPEG, PNG veya WebP görsel seçebilirsin.";
  }

  if (file.size > MAX_BYTES) {
    return `Bu dosya ${formatBytes(file.size)}; en fazla 2 MB olabilir.`;
  }

  return null;
}

function describeCoverError(error) {
  if (
    error.code === "COVER_TOO_LARGE" ||
    error.code === "PAYLOAD_TOO_LARGE"
  ) {
    return "Görsel en fazla 2 MB olabilir.";
  }

  if (
    error.code === "COVER_TYPE_NOT_ALLOWED" ||
    error.code === "COVER_CONTENT_MISMATCH"
  ) {
    return "Dosya gerçek bir JPEG, PNG veya WebP görseli değil.";
  }

  if (error.code === "RATE_LIMITED") {
    const minutes = Math.ceil((error.retryAfter ?? 60) / 60);

    return `Çok fazla yükleme yaptın. ${minutes} dakika sonra tekrar dene.`;
  }

  return error.message;
}

export default function CoverEditor({ post, onChange }) {
  const auth = useAuth();
  const inputRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!selected) {
      return;
    }

    return () => URL.revokeObjectURL(selected.url);
  }, [selected]);

  function handleFileChange(event) {
    const file = event.target.files[0] ?? null;
    const problem = file ? checkFile(file) : null;

    setError(problem);
    setNotice(null);

    if (!file || problem) {
      setSelected(null);
      return;
    }

    setSelected({
      file,
      url: URL.createObjectURL(file),
    });
  }

  function clearSelection() {
    setSelected(null);
    inputRef.current.value = "";
  }

  async function handleUpload() {
    const formData = new FormData();
    formData.append("cover", selected.file);

    setUploading(true);
    setError(null);
    setNotice(null);

    try {
      await auth.authRequest(`/api/v1/posts/${post.id}/cover`, {
        method: "PUT",
        body: formData,
      });

      clearSelection();
      setNotice("Kapak görseli güncellendi.");
      onChange();
    } catch (uploadError) {
      setError(describeCoverError(uploadError));
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!window.confirm("Kapak görseli kaldırılsın mı?")) {
      return;
    }

    setRemoving(true);
    setError(null);
    setNotice(null);

    try {
      await auth.authRequest(`/api/v1/posts/${post.id}/cover`, {
        method: "DELETE",
      });

      setNotice("Kapak görseli kaldırıldı.");
      onChange();
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setRemoving(false);
    }
  }

  const shownUrl = selected?.url ?? post.cover_url;

  return (
    <section className="editor__section">
      <h2>Kapak görseli</h2>

      {shownUrl ? (
        <img className="cover-preview" src={shownUrl} alt="" />
      ) : (
        <div className="cover-preview cover-preview--empty">
          Kapak görseli yok
        </div>
      )}

      <FormField
        ref={inputRef}
        label="Görsel seç"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hint="JPEG, PNG veya WebP; en fazla 2 MB."
        error={error}
        onChange={handleFileChange}
      />

      {notice && <StatusMessage>{notice}</StatusMessage>}

      {post.cover_url && !selected && (
        <div className="form__actions">
          <button
            type="button"
            className="link-button link-button--danger"
            disabled={removing}
            onClick={handleRemove}
          >
            {removing ? "Kaldırılıyor..." : "Kapağı kaldır"}
          </button>
        </div>
      )}

      {selected && (
        <div className="form__actions">
          <button
            type="button"
            className="button"
            disabled={uploading}
            onClick={handleUpload}
          >
            {uploading ? "Yükleniyor..." : "Yükle"}
          </button>

          <span className="form__hint">
            {selected.file.name} ·{" "}
            {formatBytes(selected.file.size)}
          </span>

          <button
            type="button"
            className="link-button"
            onClick={clearSelection}
          >
            Vazgeç
          </button>
        </div>
      )}
    </section>
  );
}
