import { Navigate, useLocation } from "react-router";
import useAuth from "../auth/useAuth.js";
import StatusMessage from "./StatusMessage.jsx";

export default function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === "checking") {
    return (
      <StatusMessage>Oturum kontrol ediliyor...</StatusMessage>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          notice: "Bu sayfayı görmek için giriş yap.",
        }}
      />
    );
  }

  return children;
}
