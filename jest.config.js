/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: -20,
    },
  },
};

export default config;
