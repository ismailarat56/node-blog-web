import { useQueryClient } from "@tanstack/react-query";
import {
  startTransition,
  useEffect,
  useEffectEvent,
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
import {
  announceSession,
  listenSession,
} from "./session-channel.js";

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

  const handleSessionMessage = useEffectEvent((type) => {
    if (type === "logout") {
      endSession();
    }

    if (type === "login" && status !== "authenticated") {
      refreshSession()
        .then((data) => {
          setUser(data.user);
          setStatus("authenticated");
        })
        .catch(() => {
          // Diğer sekmenin oturumu bu arada kapanmış olabilir.
        });
    }
  });

  useEffect(() => listenSession(handleSessionMessage), []);

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
    announceSession("login");
  }

  async function sendWithToken(path, options) {
    const sentToken = getAccessToken();

    try {
      return await apiRequest(path, {
        ...options,
        token: sentToken,
      });
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }

      if (getAccessToken() === sentToken) {
        const data = await refreshSession();
        setUser(data.user);
      }

      return apiRequest(path, {
        ...options,
        token: getAccessToken(),
      });
    }
  }

  async function logout() {
    try {
      await sendWithToken("/api/v1/auth/logout", {
        method: "POST",
      });
    } catch {
      // Oturum sunucuda zaten kapanmışsa 401 gelir;
      // yerel oturumu yine de kapatırız.
    }

    endSession();
    announceSession("logout");
  }

  function updateUser(nextUser) {
    setUser(nextUser);
  }

  function closeSession(loginState) {
    startTransition(() => {
      endSession();
      navigate("/login", { replace: true, state: loginState });
    });
    announceSession("logout");
  }

  async function authRequest(path, options = {}) {
    try {
      return await sendWithToken(path, options);
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
