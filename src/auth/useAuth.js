import { use } from "react";
import { AuthContext } from "./AuthContext.js";

export default function useAuth() {
  const auth = use(AuthContext);

  if (auth === null) {
    throw new Error(
      "useAuth yalnız AuthProvider içinde kullanılabilir."
    );
  }

  return auth;
}
