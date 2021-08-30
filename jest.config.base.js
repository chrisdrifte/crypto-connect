module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  modulePathIgnorePatterns: [".*.integration.ts"],
  testEnvironment: "node",
  verbose: true,
};
