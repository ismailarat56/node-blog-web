export class ApiError extends Error {
  constructor(status, code, message, details, retryAfter) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.retryAfter = retryAfter ?? null;
  }
}

function readRetryAfter(response) {
  const seconds = Number(response.headers.get("Retry-After"));

  if (Number.isInteger(seconds) && seconds > 0) {
    return seconds;
  }

  return null;
}

export async function apiRequest(
  path,
  { method = "GET", body, token, signal } = {}
) {
  const headers = { Accept: "application/json" };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(path, {
      method,
      headers,
      body:
        body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Sunucuya ulaşılamadı."
    );
  }

  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      response.status,
      payload?.error?.code ?? "UNEXPECTED_RESPONSE",
      payload?.error?.message ??
        "Sunucudan beklenmeyen bir yanıt geldi.",
      payload?.error?.details,
      readRetryAfter(response)
    );
  }

  return {
    data: payload.data ?? null,
    meta: payload.meta ?? null,
    message: payload.message ?? null,
  };
}

export function apiGet(path, options) {
  return apiRequest(path, options);
}
