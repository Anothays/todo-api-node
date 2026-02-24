/** @type {import('jest').Config} */
const config = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: -10,
    },
  },
};

module.exports = config;
