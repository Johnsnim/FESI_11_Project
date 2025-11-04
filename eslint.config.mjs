import next from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "**/*.test.*",
      "**/*.spec.*",
      "**/__tests__/**",
      "jest.config.*",
      "jest.setup.*",
      "**/__mocks__/**",
    ],
  },

  ...next(),
];
