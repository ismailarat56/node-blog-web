import { useNavigate } from "react-router";
import useAuth from "../auth/useAuth.js";
import PostForm from "../components/PostForm.jsx";
import { EMPTY_POST, toPostPayload } from "../utils/post-form.js";

export default function NewPostPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleCreate(values) {
    const { data } = await auth.authRequest("/api/v1/posts", {
      method: "POST",
      body: toPostPayload(values),
    });

    navigate(`/dashboard/posts/${data.id}/edit`, {
      state: {
        notice:
          "Taslak oluşturuldu. Kapak ekleyebilir veya yayınlayabilirsin.",
      },
    });
  }

  return (
    <section className="editor">
      <title>Yeni yazı · Node Blog</title>

      <h1 className="page-title">Yeni yazı</h1>

      <PostForm
        initialValues={EMPTY_POST}
        submitLabel="Taslak olarak kaydet"
        submittingLabel="Kaydediliyor..."
        onSubmit={handleCreate}
      />
    </section>
  );
}
