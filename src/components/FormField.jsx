import { useId } from "react";

export default function FormField({
  label,
  hint,
  error,
  as: Control = "input",
  ...controlProps
}) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="form__field">
      <label htmlFor={id}>{label}</label>

      <Control
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...controlProps}
      />

      {message && (
        <p
          id={messageId}
          className={error ? "form__error" : "form__hint"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
