import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_TARGET = "http://127.0.0.1:8080";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": API_TARGET,
      "/uploads": API_TARGET,
    },
  },
});
