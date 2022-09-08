/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "vue/multi-word-component-names": "off",
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    indent: [2, 2],
    camelcase: 0,
    "class-methods-use-this": 0,
    "new-cap": 0,
    "no-new": 1,
    "no-shadow": 0,
    "no-console": 0,
    "no-underscore-dangle": 0,
    "no-confusing-arrow": 0,
    "no-plusplus": [
      "error",
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    "no-param-reassign": 0,
    "func-style": 0,
    "prefer-default-export": 0,
    "max-len": 0,
    "consistent-return": 0,
  },
  overrides: [
    {
      files: ["cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
};
