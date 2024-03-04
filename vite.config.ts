/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, //allowed to use the methods from the Vitest library without specifically importing
    // coverage: { reporter: ["text", "html"] },
    environment: "jsdom",
    setupFiles: "src/test/setup.tsx", //和tsconfig共用,确保测试和便衣的一致
    // reporters: ["html"], // reporter in configuration to generate HTML output and preview the results of tests
    // ...
  },
});
