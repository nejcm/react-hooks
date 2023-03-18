module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*[s|S]aga.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/tests/**/*',
    '!**/types/**/*',
  ],
  coverageReporters: ['json-summary', 'json', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs|cjs)$': '<rootDir>/config/babelTransform.cjs',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@trixtateam|nanoid|uuid|axios)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  resetMocks: true,
};
