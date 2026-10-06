export function readTokenExpiry(token) {
  try {
    const payload = token
      .split(".")[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/");
    const { exp } = JSON.parse(atob(payload));

    return Number.isInteger(exp) ? exp * 1000 : null;
  } catch {
    return null;
  }
}
