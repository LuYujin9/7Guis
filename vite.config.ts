/// <reference types="vitest" />
import { defineConfig, resolveConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "frontend/test/setup.tsx",
    alias: {
      "$7-GUIS/backend/filePath": path.resolve("./mocks/filePath.js"),
    },
  },
});
