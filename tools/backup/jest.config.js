module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coverageReporters: ['text', 'lcov']
};