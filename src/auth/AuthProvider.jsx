import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { apiRequest } from "../api/client.js";
import { AuthContext } from "./AuthContext.js";
import {
  clearStoredToken,
  readStoredToken,
  storeToken,
} from "./token-storage.js";

function getStatus(token, user) {
  if (!token) {
    return "anonymous";
  }

  if (!user) {
    return "checking";
  }

  return "authenticated";
}

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(null);

  const status = getStatus(token, user);

  useEffect(() => {
    if (!token || user) {
      return;
    }

    const controller = new AbortController();

    apiRequest("/api/v1/auth/me", {
      token,
      signal: controller.signal,
    })
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        clearStoredToken();
        setToken(null);
      });

    return () => controller.abort();
  }, [token, user]);

  function endSession() {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }

  async function login(email, password) {
    const { data } = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    });

    storeToken(data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  }

  async function logout() {
    try {
      await apiRequest("/api/v1/auth/logout", {
        method: "POST",
        token,
      });
    } catch {
      // Token zaten geçersizse API 401 döner;
      // yerel oturumu yine de kapatırız.
    }

    endSession();
  }

  async function authRequest(path, options = {}) {
    try {
      return await apiRequest(path, { ...options, token });
    } catch (error) {
      if (error.status === 401) {
        endSession();
        navigate("/login", {
          state: {
            from: location,
            notice: "Oturumun kapandı. Tekrar giriş yap.",
          },
        });
      }

      throw error;
    }
  }

  const value = {
    status,
    user,
    login,
    logout,
    authRequest,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
