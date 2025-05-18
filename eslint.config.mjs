import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Estendi le configurazioni di Next.js e TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Disabilita la regola react/no-unescaped-entities
  {
    rules: {
      "react/no-unescaped-entities": 0,    // o "off"
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
