/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const base = require("./jest.config.base");

module.exports = {
  ...base,
  roots: ["<rootDir>"],
  projects: [
    "<rootDir>/packages/binance",
    "<rootDir>/packages/coinbase-pro",
    "<rootDir>/packages/coinbase",
    "<rootDir>/packages/common",
    "<rootDir>/packages/errors",
    "<rootDir>/packages/ethereum",
    "<rootDir>/packages/kraken",
  ],
};
