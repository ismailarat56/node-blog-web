import { useQueryClient } from "@tanstack/react-query";
import {
  startTransition,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { apiRequest } from "../api/client.js";
import { AuthContext } from "./AuthContext.js";
import {
  getAccessToken,
  refreshSession,
  setAccessToken,
} from "./session.js";

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    refreshSession()
      .then((data) => {
        if (!ignore) {
          setUser(data.user);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus("anonymous");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  function startSession(data) {
    setAccessToken(data.access_token);
    setUser(data.user);
    setStatus("authenticated");
  }

  function endSession() {
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
    queryClient.clear();
  }

  async function login(email, password) {
    const { data } = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    });

    startSession(data);
  }

  async function logout() {
    try {
      await apiRequest("/api/v1/auth/logout", {
        method: "POST",
        token: getAccessToken(),
      });
    } catch {
      // Oturum sunucuda zaten kapanmışsa 401 gelir;
      // yerel oturumu yine de kapatırız.
    }

    endSession();
  }

  function updateUser(nextUser) {
    setUser(nextUser);
  }

  function closeSession(loginState) {
    startTransition(() => {
      endSession();
      navigate("/login", { replace: true, state: loginState });
    });
  }

  async function authRequest(path, options = {}) {
    try {
      return await apiRequest(path, { ...options, token: getAccessToken() });
    } catch (error) {
      if (error.status === 401) {
        closeSession({
          from: location,
          notice: "Oturumun kapandı. Tekrar giriş yap.",
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
    closeSession,
    updateUser,
    authRequest,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
