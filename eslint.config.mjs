import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    ...js.configs.recommended, // Use recommended rules
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
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**"
    ] // Replace globalIgnores with ignores property
  }
];
