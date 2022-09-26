// jest.config.js
module.exports = {
	setupFilesAfterEnv: ['./jest.setup.js'],
	bail: true,
	moduleNameMapper: {
		'^@components(.*)$': '<rootDir>/components$1',
		'^@pages(.*)$': '<rootDir>/pages$1',
		'^@hooks(.*)$': '<rootDir>/hooks$1',
		'^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
	},
	testEnvironment: 'jest-environment-jsdom',
};
process.env = Object.assign(process.env, {
	NEXT_PUBLIC_DEPLOY_ENV: 'local',
	VAR_NAME_2: 'varValue2',
});
