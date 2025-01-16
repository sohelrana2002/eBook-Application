import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "eslint no-undef": "warn",
    },
  },
  pluginJs.configs.recommended,
];
