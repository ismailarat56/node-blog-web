export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiGet(path, { signal } = {}) {
  let response;

  try {
    response = await fetch(path, {
      headers: { Accept: "application/json" },
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

  let body = null;

  try {
    body = await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
  }

  if (!response.ok || !body?.success) {
    throw new ApiError(
      response.status,
      body?.error?.code ?? "UNEXPECTED_RESPONSE",
      body?.error?.message ??
        "Sunucudan beklenmeyen bir yanıt geldi.",
      body?.error?.details
    );
  }

  return {
    data: body.data,
    meta: body.meta ?? null,
  };
}
