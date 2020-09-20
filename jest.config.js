module.exports = {
  rootDir: path.join(__dirname, "test"),
  verbose: true,
  moduleFileExtensions: ["js"],
  testMatch: ["**/*.test.ts"],
  setupFiles: ["<rootDir>/lambdas/setEnvVars.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
