import { QueryClient } from "@tanstack/react-query";

function shouldRetry(failureCount, error) {
  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  return failureCount < 1;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetry,
    },
  },
});
