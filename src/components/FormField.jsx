import { useId } from "react";

export default function FormField({ label, name, hint, ...inputProps }) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="form__field">
      <label htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        id={id}
        name={name}
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && (
        <p id={hintId} className="form__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
