// The app's JS files share one global scope (they are joined into one script by build/build_app.py),
// so each file is checked as part of the whole: run `npm run lint`, which lints the joined build.
import globals from "globals";
export default [
  {
    files: ["build/app.lint.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "script", globals: { ...globals.browser } },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { vars: "local", args: "none", caughtErrors: "none" }],
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-redeclare": "error",
      "no-self-assign": "error",
      "no-dupe-else-if": "error",
      "no-const-assign": "error",
      "no-func-assign": "error",
      "no-sparse-arrays": "error",
      "eqeqeq": ["warn", "smart"]
    }
  }
];
