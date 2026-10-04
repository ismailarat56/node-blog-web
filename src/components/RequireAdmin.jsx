import { Link } from "react-router";
import useAuth from "../auth/useAuth.js";
import StatusMessage from "./StatusMessage.jsx";

export default function RequireAdmin({ children }) {
  const auth = useAuth();

  if (auth.user.role !== "admin") {
    return (
      <StatusMessage type="error">
        Bu bölüm yalnız yöneticilere açık.{" "}
        <Link to="/">Ana sayfaya dön</Link>
      </StatusMessage>
    );
  }

  return children;
}
