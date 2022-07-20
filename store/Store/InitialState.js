import Utils from '../../services/utils/Utils';

import OpenQClient from '../../services/ethers/OpenQClient';
import OpenQSubgraphClient from '../../services/subgraph/OpenQSubgraphClient';
import GithubRepository from '../../services/github/GithubRepository';
import TokenClient from '../../services/coins/TokenClient';
import Logger from '../../services/logger/Logger';
import OpenQPrismaClient from '../../services/openq-api/OpenQPrismaClient';

import MockGithubRepository from '../../services/github/MockGithubRepository';
import MockOpenQClient from '../../services/ethers/MockOpenQClient';
import MockOpenQSubgraphClient from '../../services/subgraph/MockOpenQSubgraphClient';
import MockTokenClient from '../../services/coins/MockTokenClient';
import MockOpenQPrismaClient from '../../services/openq-api/MockOpenQPrismaClient';

let InitialState = {};
switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
case 'local':
	InitialState = {
		openQClient: new MockOpenQClient(),
		githubRepository: new MockGithubRepository(),
		openQSubgraphClient: new MockOpenQSubgraphClient(),
		tokenClient: new MockTokenClient(),
		logger: new Logger(true),
		utils: new Utils(),
		openQPrismaClient: new MockOpenQPrismaClient()
	};
	break;
case 'docker':
	InitialState = {
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		logger: new Logger(true),
		utils: new Utils(),
		openQPrismaClient: new OpenQPrismaClient(),
	};
	break;
case 'development':
	InitialState = {
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		logger: new Logger(true),
		utils: new Utils(),
		openQPrismaClient: new OpenQPrismaClient(),
	};
	break;
case 'staging':
	InitialState = {
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		logger: new Logger(true),
		utils: new Utils(),
		openQPrismaClient: new OpenQPrismaClient(),
	};
	break;
case 'production':
	InitialState = {
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		logger: new Logger(false),
		utils: new Utils(),
		openQPrismaClient: new OpenQPrismaClient(),
	};
	break;
case 'ethbarcelona':
	InitialState = {
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		logger: new Logger(false),
		utils: new Utils(),
		openQPrismaClient: new OpenQPrismaClient(),
	};
	break;
default:
	throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
}

export default InitialState;