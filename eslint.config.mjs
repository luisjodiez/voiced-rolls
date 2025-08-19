import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }, // Support both browser and Node.js environments
      ecmaVersion: 12,
      sourceType: "module" // Enable ES module syntax
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      eqeqeq: "error",
      curly: "error"
    }
  },
  {
    files: ["__tests__/**/*.js"],
    languageOptions: {
      globals: { ...globals.jest } // Add Jest globals for test files
    }
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        game: true,
        ui: true,
        Hooks: true // Add Foundry VTT-specific globals
      }
    }
  },
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**"
  ])
]);
