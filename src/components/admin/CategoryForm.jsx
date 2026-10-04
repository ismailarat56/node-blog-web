import { useState } from "react";
import { slugify } from "../../utils/slugify.js";
import FormField from "../FormField.jsx";
import StatusMessage from "../StatusMessage.jsx";

const FIELDS = ["name", "slug", "description"];
const SLUG_PATTERN = "[a-z0-9]+(-[a-z0-9]+)*";

const FIELD_ERRORS = {
  INVALID_CATEGORY_NAME: {
    field: "name",
    message: "Ad 2 ile 100 karakter arasında olmalı.",
  },
  INVALID_CATEGORY_SLUG: {
    field: "slug",
    message: "Slug küçük harf, rakam ve tek tirelerden oluşmalı.",
  },
  CATEGORY_SLUG_ALREADY_EXISTS: {
    field: "slug",
    message:
      "Bu slug kullanılıyor. Silinmiş bir kategoriye ait olabilir.",
  },
  INVALID_CATEGORY_DESCRIPTION: {
    field: "description",
    message: "Açıklama en fazla 2000 karakter olabilir.",
  },
};

export default function CategoryForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialValues);
  const [slugEdited, setSlugEdited] = useState(
    initialValues.slug !== ""
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const values = {
    ...form,
    slug: slugEdited
      ? form.slug
      : slugify(form.name, { maxLength: 120 }),
  };

  const changes = {};

  for (const field of FIELDS) {
    if (values[field] !== initialValues[field]) {
      changes[field] = values[field];
    }
  }

  const isDirty = Object.keys(changes).length > 0;

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "slug") {
      setSlugEdited(true);
    }

    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    try {
      await onSubmit(values, changes);
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
        label="Ad"
        name="name"
        required
        minLength={2}
        maxLength={100}
        value={values.name}
        onChange={handleChange}
        error={fieldErrors.name}
      />

      <FormField
        label="Slug"
        name="slug"
        required
        maxLength={120}
        pattern={SLUG_PATTERN}
        hint={
          slugEdited
            ? "Küçük harf, rakam ve tire."
            : "Addan otomatik üretiliyor; elle de yazabilirsin."
        }
        value={values.slug}
        onChange={handleChange}
        error={fieldErrors.slug}
      />

      <FormField
        as="textarea"
        label="Açıklama"
        name="description"
        rows={3}
        maxLength={2000}
        hint="İsteğe bağlı."
        value={values.description}
        onChange={handleChange}
        error={fieldErrors.description}
      />

      {formError && (
        <StatusMessage type="error">{formError.message}</StatusMessage>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="button"
          disabled={!isDirty || submitting}
        >
          {submitting ? "Kaydediliyor..." : submitLabel}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={onCancel}
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}
