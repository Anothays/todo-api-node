/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  coverageReporters: ["lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "app.js",
    "database/**/*.js",
    "helpers/**/*.js",
    "routes/**/*.js",
    "!config/swagger.js",
    "!routes/schemas/todo.schemas.js",
  ],
  coveragePathIgnorePatterns: ["/config/swagger\\.js$", "/routes/schemas/todo\\.schemas\\.js$"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 90,
    },
  },
};

export default config;
