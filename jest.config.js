// jest.config.js
module.exports = {
	setupFilesAfterEnv: ['./jest.setup.js'],
	
	moduleNameMapper: {
		'^@components(.*)$': '<rootDir>/components$1',
		'^@pages(.*)$': '<rootDir>/pages$1',
		'^@hooks(.*)$': '<rootDir>/hooks$1',
	},
	testEnvironment: 'jest-environment-jsdom',
};
process.env = Object.assign(process.env, {
	NEXT_PUBLIC_DEPLOY_ENV: 'local',
	VAR_NAME_2: 'varValue2'
});