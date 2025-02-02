import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@stylistic": stylistic
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-unsafe-assignment": ["warn"],
      "@typescript-eslint/no-misused-promises": ["warn"],
      "@typescript-eslint/no-unsafe-call": ["warn"],
      "@typescript-eslint/no-unsafe-argument": ["warn"],
      "@typescript-eslint/no-unsafe-member-access": ["warn"],
      "@typescript-eslint/no-unsafe-return": ["warn"],
      "@typescript-eslint/no-empty-object-type": ["off"],
      "@typescript-eslint/no-unnecessary-condition": ["warn"],
      "@typescript-eslint/restrict-template-expressions": ["off"],
      "@typescript-eslint/no-floating-promises": ["warn"],
      "@typescript-eslint/no-dynamic-delete": ["off"],
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/quote-props": ["error", "consistent-as-needed"],
      "@stylistic/block-spacing": ["error", "always"],
      "@stylistic/key-spacing": ["error", { "afterColon": true }],
      "@stylistic/no-trailing-spaces": ["error"],
      "@stylistic/no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/space-before-blocks": ["warn", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/semi-style": ["error", "last"],
      "@stylistic/semi": ["error", "always"],
      "no-mixed-spaces-and-tabs": "error",
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/prop-types": ["off"],
    },
  },
)
