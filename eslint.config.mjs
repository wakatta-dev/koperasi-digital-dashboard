import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type for now
      "no-console": "warn", // Warn on console logs, but do not error
      "no-unused-vars": "warn", // Warn on unused variables
      "react-hooks/rules-of-hooks": "error", // Ensure hooks are used correctly
      "react-hooks/exhaustive-deps": "warn", // Warn on missing dependencies in hooks
    }
  }
];

export default eslintConfig;
