import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "sort-imports": ["error"],
      "no-duplicate-imports": ["error"],
    },
  },
];
