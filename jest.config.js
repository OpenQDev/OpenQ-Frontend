// jest.config.js

const nextJest = require('next/jest');

const createJestConfig = nextJest();

const customJestConfig = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  bail: true,
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/components$1',
    '^@pages(.*)$': '<rootDir>/pages$1',
    '^@hooks(.*)$': '<rootDir>/hooks$1',
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig returns an async function that returns a jest config -
// so instead of doing this:
// module.exports = createJestConfig(customJestConfig)

// Take the returned async function...
const asyncConfig = createJestConfig(customJestConfig);

process.env = Object.assign(process.env, {
  NEXT_PUBLIC_DEPLOY_ENV: 'local',
  VAR_NAME_2: 'varValue2',
});

// and wrap it...
module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    // ...your ignore patterns
  ];
  config.transformIgnorePatterns = ['node_modules/(?!axios)/'];

  return config;
};
