import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-gemini": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-gemini/, ""),
      },
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "node",
  },
} as any);
