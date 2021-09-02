/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const base = require("./jest.config.base");

module.exports = {
  ...base,
  roots: ["<rootDir>"],
  projects: [
    "<rootDir>/packages/coinbase-pro",
    "<rootDir>/packages/coinbase",
    "<rootDir>/packages/kraken",
    "<rootDir>/packages/common",
    "<rootDir>/packages/errors",
  ],
};
