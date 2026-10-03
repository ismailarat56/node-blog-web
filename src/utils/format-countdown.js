export function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${rest}`;
}
