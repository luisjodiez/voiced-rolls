import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        game: "readonly",
        ui: "readonly",
        Hooks: "readonly",
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "eqeqeq": "error",
      "curly": "error",
      "@typescript-eslint/no-explicit-any": "off", // Allowed for Foundry VTT interactions
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "coverage/**",
    ],
  }
);
