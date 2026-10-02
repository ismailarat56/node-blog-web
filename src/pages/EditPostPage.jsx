import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import useAuth from "../auth/useAuth.js";
import CommentModeration from "../components/CommentModeration.jsx";
import CoverEditor from "../components/CoverEditor.jsx";
import PostForm from "../components/PostForm.jsx";
import PostStatusActions from "../components/PostStatusActions.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useApi from "../hooks/useApi.js";
import {
  toFormValues,
  toPostPayload,
} from "../utils/post-form.js";

export default function EditPostPage() {
  const { id } = useParams();
  const auth = useAuth();
  const location = useLocation();

  const [notice, setNotice] = useState(
    location.state?.notice ?? null
  );

  const post = useApi(
    `/api/v1/posts/${encodeURIComponent(id)}`,
    auth.authRequest
  );

  if (post.loading) {
    return <StatusMessage>Yazı yükleniyor...</StatusMessage>;
  }

  if (
    post.error?.code === "POST_NOT_FOUND" ||
    post.error?.code === "INVALID_POST_ID"
  ) {
    return (
      <StatusMessage type="error">
        Bu yazı bulunamadı.{" "}
        <Link to="/dashboard">Yazılarıma dön</Link>
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

  const canManage =
    post.data.author.id === auth.user.id ||
    auth.user.role === "admin";

  if (!canManage) {
    return (
      <StatusMessage type="error">
        Bu yazıyı yalnız yazarı düzenleyebilir.{" "}
        <Link to={`/posts/${post.data.slug}`}>Yazıyı oku</Link>
      </StatusMessage>
    );
  }

  async function handleSave(values, changes) {
    await auth.authRequest(`/api/v1/posts/${post.data.id}`, {
      method: "PATCH",
      body: toPostPayload(changes),
    });

    setNotice("Değişiklikler kaydedildi.");
    post.reload();
  }

  return (
    <div className="editor">
      <title>{`${post.data.title} · Düzenle · Node Blog`}</title>

      <div>
        <h1 className="page-title">Yazıyı düzenle</h1>
        <p className="form__hint">
          Adres: /posts/{post.data.slug}
        </p>
      </div>

      {notice && <StatusMessage>{notice}</StatusMessage>}

      <PostStatusActions
        post={post.data}
        onChange={post.reload}
      />

      <section className="editor__section">
        <h2>İçerik</h2>

        <PostForm
          key={post.data.id}
          initialValues={toFormValues(post.data)}
          submitLabel="Kaydet"
          submittingLabel="Kaydediliyor..."
          onSubmit={handleSave}
        />
      </section>

      <CoverEditor post={post.data} onChange={post.reload} />
      <CommentModeration postId={post.data.id} />
    </div>
  );
}
