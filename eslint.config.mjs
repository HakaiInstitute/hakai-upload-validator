import js from "@eslint/js";
import globals from "globals";
import mocha from "eslint-plugin-mocha";

export default [
  {
    ignores: ["node_modules/"],
  },
  js.configs.recommended,
  {
    rules: {
      // Allow `const { dropped, ...rest } = obj` to omit a key
      "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    },
  },
  {
    // The library runs in both Node (hakai-api) and the browser (data portal)
    files: ["src/**/*.js", "config/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: globals.node,
    },
  },
  {
    // page.evaluate() callbacks run in the browser
    files: ["test/browser/**/*.mjs"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["test/**/*.spec.js"],
    ...mocha.configs.recommended,
    rules: {
      ...mocha.configs.recommended.rules,
      // The specs use arrow functions throughout and never rely on mocha's `this`
      "mocha/no-mocha-arrows": "off",
    },
  },
];
