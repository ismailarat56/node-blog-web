import { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";

export default function useApi(path) {
  const [result, setResult] = useState({
    path: null,
    data: null,
    meta: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    apiGet(path, { signal: controller.signal })
      .then(({ data, meta }) => {
        setResult({ path, data, meta, error: null });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setResult({
          path,
          data: null,
          meta: null,
          error,
        });
      });

    return () => controller.abort();
  }, [path]);

  const isCurrent = result.path === path;

  return {
    loading: !isCurrent,
    data: isCurrent ? result.data : null,
    meta: isCurrent ? result.meta : null,
    error: isCurrent ? result.error : null,
  };
}
