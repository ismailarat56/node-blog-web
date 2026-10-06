import { useState } from "react";
import { USER_FIELD_ERRORS } from "../../utils/user-form.js";
import FormField from "../FormField.jsx";
import StatusMessage from "../StatusMessage.jsx";

export default function UserForm({
  initialValues,
  emailHint,
  emailLocked = false,
  submitLabel,
  submittingLabel,
  onSubmit,
}) {
  const [form, setForm] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const changes = {};

  for (const field of Object.keys(initialValues)) {
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
      const known = USER_FIELD_ERRORS[submitError.code];

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
        value={form.name}
        onChange={handleChange}
        error={fieldErrors.name}
      />

      <FormField
        label="E-posta"
        name="email"
        type="email"
        required
        maxLength={255}
        disabled={emailLocked}
        hint={emailHint}
        value={form.email}
        onChange={handleChange}
        error={fieldErrors.email}
      />

      {"password" in initialValues && (
        <FormField
          label="Parola"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={15}
          maxLength={128}
          hint="En az 15 karakter. Kullanıcıya güvenli bir yoldan ilet; Hesabım'dan değiştirebilir."
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />
      )}

      {formError && (
        <StatusMessage type="error">{formError.message}</StatusMessage>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="button"
          disabled={submitting || !isDirty}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
