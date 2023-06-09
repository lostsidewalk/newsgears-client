module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended", // For Vue.js projects
  ],
  parserOptions: {
    parser: "babel-eslint", // or '@babel/eslint-parser' for Vue 3
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    // Your custom rules go here
  },
};
