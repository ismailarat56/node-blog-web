export default function StatusMessage({
  type = "info",
  children,
}) {
  return (
    <p
      className={`status status--${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
