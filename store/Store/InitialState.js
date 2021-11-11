import GithubRepository from '../../services/github/GithubRepository';
import MockGithubRepository from '../../services/github/MockGithubRepository';
import Utils from '../../services/utils/Utils';
import OpenQClient from '../../services/ethers/OpenQClient';
import MockOpenQClient from '../../services/ethers/MockOpenQClient';

let InitialState = {};
switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
case 'local':
	InitialState = {
		baseUrl: 'http://localhost:3000',
		authBaseUrl: 'http://localhost:3030',
		oracleBaseUrl: 'http://localhost:3030',
		apiBaseUrl: 'http://localhost:3030',
		coinApiBaseUrl: 'http://localhost:3030',
		openQClient: new MockOpenQClient(),
		githubRepository: new MockGithubRepository(),
		utils: new Utils(),
	};
	break;
case 'docker':
	InitialState = {
		baseUrl: 'http://localhost:3000',
		authBaseUrl: 'http://localhost:3001',
		oracleBaseUrl: 'http://localhost:8090',
		apiBaseUrl: 'http://localhost:4000',
		coinApiBaseUrl: 'http://localhost:8081',
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		utils: new Utils(),
	};
	break;
case 'development':
	InitialState = {
		baseUrl: 'https://development.openq.dev',
		authBaseUrl: 'https://development.openq.dev/oauth',
		oracleBaseUrl: 'https://development.openq.dev/oracle',
		apiBaseUrl: 'https://development.openq.dev/api',
		coinApiBaseUrl: 'https://development.openq.dev/coinapi',
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		utils: new Utils(),
	};
	break;
case 'staging':
	InitialState = {
		baseUrl: 'https://staging.openq.dev',
		authBaseUrl: 'https://staging.openq.dev/oauth',
		oracleBaseUrl: 'https://staging.openq.dev/oracle',
		apiBaseUrl: 'https://staging.openq.dev/api',
		coinApiBaseUrl: 'https://staging.openq.dev/coinapi',
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		utils: new Utils(),
	};
	break;
case 'production':
	InitialState = {
		baseUrl: 'https://app.openq.dev',
		authBaseUrl: 'https://app.openq.dev/oauth',
		oracleBaseUrl: 'https://app.openq.dev/oracle',
		apiBaseUrl: 'https://app.openq.dev/api',
		coinApiBaseUrl: 'https://app.openq.dev/coinapi',
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		utils: new Utils(),
	};
	break;
default:
	throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
}

export default InitialState;