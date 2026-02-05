/** @format */

/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true, // biar bisa pake describe/it/expect tanpa import
    setupFiles: ["./src/setupTests.ts"], // opsional kalau kamu punya setup khusus
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/__tests__/**", "src/setupTests.ts"],
      thresholds: {
        lines: 90,
        statements: 90,
        functions: 90,
        branches: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    jsx: "automatic", // biar support JSX otomatis (React 17+)
  },
});
