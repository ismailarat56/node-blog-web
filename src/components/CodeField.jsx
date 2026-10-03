import FormField from "./FormField.jsx";

export default function CodeField({
  value,
  onChange,
  ...fieldProps
}) {
  return (
    <FormField
      label="Doğrulama kodu"
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      required
      hint="E-postana gelen 6 haneli kod. 10 dakika geçerli."
      value={value}
      onChange={(event) =>
        onChange(event.target.value.replace(/\D/g, ""))
      }
      {...fieldProps}
    />
  );
}
