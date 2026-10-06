export const API_TROUBLE_EVENT = "api:trouble";

export function reportApiTrouble() {
  window.dispatchEvent(new Event(API_TROUBLE_EVENT));
}

export async function checkApiHealth(signal) {
  try {
    const response = await fetch("/health", {
      headers: { Accept: "application/json" },
      signal,
    });

    return response.ok;
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    return false;
  }
}
