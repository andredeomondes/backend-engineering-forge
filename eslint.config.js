import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    ".forge/**",
    "archive/**",
    "solutions/**",
    "exercises/**",
  ]),
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    files: ["exercises/**/*.js"],
    rules: {
      "no-unused-vars": "off",
      "prefer-const": "off",
      eqeqeq: "off",
    },
  },
  {
    files: ["tools/forge-web/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      ...reactHooks.configs.flat.recommended.rules,
    },
  },
]);
