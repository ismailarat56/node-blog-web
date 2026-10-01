const STORAGE_KEY = "node-blog.access-token";

export function readStoredToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeToken(value) {
  sessionStorage.setItem(STORAGE_KEY, value);
}

export function clearStoredToken() {
  sessionStorage.removeItem(STORAGE_KEY);
}
