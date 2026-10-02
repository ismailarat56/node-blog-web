import { useState } from "react";
import useApi from "../hooks/useApi.js";
import FormField from "./FormField.jsx";
import StatusMessage from "./StatusMessage.jsx";

const FIELDS = ["title", "excerpt", "content", "category_id"];

const FIELD_ERRORS = {
  INVALID_POST_TITLE: {
    field: "title",
    message: "Başlık 3 ile 200 karakter arasında olmalı.",
  },
  INVALID_POST_EXCERPT: {
    field: "excerpt",
    message: "Özet en fazla 500 karakter olabilir.",
  },
  INVALID_POST_CONTENT: {
    field: "content",
    message: "İçerik boş olamaz.",
  },
  INVALID_POST_CATEGORY: {
    field: "category_id",
    message: "Bir kategori seç.",
  },
  CATEGORY_NOT_AVAILABLE: {
    field: "category_id",
    message: "Bu kategori artık kullanılamıyor.",
  },
};

function describeFormError(error) {
  if (error.status === 413) {
    return "Yazı çok uzun: API 20 KB'tan büyük istekleri kabul etmiyor.";
  }

  return error.message;
}

export default function PostForm({
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
}) {
  const categories = useApi("/api/v1/public/categories");

  const [form, setForm] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const changes = {};

  for (const field of FIELDS) {
    if (form[field] !== initialValues[field]) {
      changes[field] = form[field];
    }
  }

  const isDirty = Object.keys(changes).length > 0;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    try {
      await onSubmit(form, changes);
    } catch (submitError) {
      const known = FIELD_ERRORS[submitError.code];

      if (known) {
        setFieldErrors({ [known.field]: known.message });
      } else {
        setFormError(submitError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormField
        label="Başlık"
        name="title"
        required
        minLength={3}
        maxLength={200}
        value={form.title}
        onChange={handleChange}
        error={fieldErrors.title}
      />

      <FormField
        as="select"
        label="Kategori"
        name="category_id"
        required
        value={form.category_id}
        onChange={handleChange}
        error={fieldErrors.category_id}
      >
        <option value="">Kategori seç</option>
        {categories.data?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </FormField>

      <FormField
        as="textarea"
        label="Özet"
        name="excerpt"
        rows={3}
        maxLength={500}
        hint={`İsteğe bağlı. ${500 - form.excerpt.length} karakter kaldı.`}
        value={form.excerpt}
        onChange={handleChange}
        error={fieldErrors.excerpt}
      />

      <FormField
        as="textarea"
        label="İçerik"
        name="content"
        rows={14}
        required
        hint={`${form.content.length} karakter`}
        value={form.content}
        onChange={handleChange}
        error={fieldErrors.content}
      />

      {formError && (
        <StatusMessage type="error">
          {describeFormError(formError)}
        </StatusMessage>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="button"
          disabled={!isDirty || submitting}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
