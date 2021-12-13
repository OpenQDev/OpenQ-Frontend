import Utils from '../../services/utils/Utils';

import OpenQClient from '../../services/ethers/OpenQClient';
import OpenQSubgraphClient from '../../services/subgraph/OpenQSubgraphClient';
import GithubRepository from '../../services/github/GithubRepository';
import TokenClient from '../../services/coins/TokenClient';

import MockGithubRepository from '../../services/github/MockGithubRepository';
import MockOpenQClient from '../../services/ethers/MockOpenQClient';
import MockOpenQSubgraphClient from '../../services/subgraph/MockOpenQSubgraphClient';
import MockTokenClient from '../../services/coins/MockTokenClient';

// Token Metadata
import mumbaiTokenMetadata from '../../constants/polygon-mumbai.json';
import polygonMainnetTokenMetadata from '../../constants/polygon-mainnet.json';
import mumbaiTokens from '../../constants/polygon-mumbai-tokens.json';
import polygonMainnetTokens from '../../constants/polygon-mainnet-tokens.json';

let InitialState = {};
switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
	case 'local':
		InitialState = {
			baseUrl: 'http://localhost:3000',
			authBaseUrl: 'http://localhost:3030',
			oracleBaseUrl: 'http://localhost:3030',
			apiBaseUrl: 'http://localhost:3030',
			coinApiBaseUrl: 'http://localhost:3030',
			tokenMetadata: mumbaiTokenMetadata,
			tokens: mumbaiTokens,
			openQClient: new MockOpenQClient(),
			githubRepository: new MockGithubRepository(),
			openQSubgraphClient: new MockOpenQSubgraphClient(),
			tokenClient: new MockTokenClient(),
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
			tokenMetadata: mumbaiTokenMetadata,
			tokens: mumbaiTokens,
			openQClient: new OpenQClient(),
			githubRepository: new GithubRepository(),
			openQSubgraphClient: new OpenQSubgraphClient(),
			tokenClient: new TokenClient(),
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
			tokenMetadata: mumbaiTokenMetadata,
			tokens: mumbaiTokens,
			openQClient: new OpenQClient(),
			githubRepository: new GithubRepository(),
			openQSubgraphClient: new OpenQSubgraphClient(),
			tokenClient: new TokenClient(),
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
			tokenMetadata: polygonMainnetTokenMetadata,
			tokens: polygonMainnetTokens,
			openQClient: new OpenQClient(),
			githubRepository: new GithubRepository(),
			openQSubgraphClient: new OpenQSubgraphClient(),
			tokenClient: new TokenClient(),
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
			tokenMetadata: polygonMainnetTokenMetadata,
			tokens: polygonMainnetTokens,
			openQClient: new OpenQClient(),
			githubRepository: new GithubRepository(),
			tokenClient: new TokenClient(),
			utils: new Utils(),
		};
		break;
	default:
		throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
}

export default InitialState;