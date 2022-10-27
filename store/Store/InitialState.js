import Utils from '../../services/utils/Utils';

import OpenQClient from '../../services/ethers/OpenQClient';
import OpenQSubgraphClient from '../../services/subgraph/OpenQSubgraphClient';
import AuthService from '../../services/auth/AuthService';
import GithubRepository from '../../services/github/GithubRepository';
import TokenClient from '../../services/coins/TokenClient';
import Logger from '../../services/logger/Logger';
import OpenQPrismaClient from '../../services/openq-api/OpenQPrismaClient';
import SuperfluidClient from '../../services/SuperfluidClient/SuperfluidClient';

import MockGithubRepository from '../../services/github/MockGithubRepository';
import MockOpenQClient from '../../services/ethers/MockOpenQClient';
import MockOpenQSubgraphClient from '../../services/subgraph/MockOpenQSubgraphClient';
import MockTokenClient from '../../services/coins/MockTokenClient';
import MockOpenQPrismaClient from '../../services/openq-api/MockOpenQPrismaClient';
import MockAuthService from '../../services/auth/MockAuthService.js';

let InitialState = {};
switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
  case 'local':
    InitialState = {
      openQClient: new MockOpenQClient(),
      authService: new MockAuthService(),
      githubRepository: new MockGithubRepository(),
      openQSubgraphClient: new MockOpenQSubgraphClient(),
      tokenClient: new MockTokenClient(),
      logger: new Logger('DEV'),
      utils: new Utils(),
      openQPrismaClient: new MockOpenQPrismaClient(),
      superfluidClient: new SuperfluidClient(),
    };
    break;
  case 'docker':
    InitialState = {
      openQClient: new MockOpenQClient(),
      authService: new AuthService(),
      githubRepository: new GithubRepository(),
      openQSubgraphClient: new OpenQSubgraphClient(),
      tokenClient: new TokenClient(),
      logger: new Logger('DEV'),
      utils: new Utils(),
      openQPrismaClient: new OpenQPrismaClient(),
      superfluidClient: new SuperfluidClient(),
    };
    break;
  case 'development':
    InitialState = {
      openQClient: new OpenQClient(),
      authService: new AuthService(),
      githubRepository: new GithubRepository(),
      openQSubgraphClient: new OpenQSubgraphClient(),
      tokenClient: new TokenClient(),
      logger: new Logger('DEV'),
      utils: new Utils(),
      openQPrismaClient: new OpenQPrismaClient(),
      superfluidClient: new SuperfluidClient(),
    };
    break;
  case 'staging':
    InitialState = {
      openQClient: new OpenQClient(),
      authService: new AuthService(),
      githubRepository: new GithubRepository(),
      openQSubgraphClient: new OpenQSubgraphClient(),
      tokenClient: new TokenClient(),
      logger: new Logger('DEV'),
      utils: new Utils(),
      openQPrismaClient: new OpenQPrismaClient(),
      superfluidClient: new SuperfluidClient(),
    };
    break;
  case 'production':
    InitialState = {
      openQClient: new OpenQClient(),
      authService: new AuthService(),
      githubRepository: new GithubRepository(),
      openQSubgraphClient: new OpenQSubgraphClient(),
      tokenClient: new TokenClient(),
      logger: new Logger('PROD'),
      utils: new Utils(),
      openQPrismaClient: new OpenQPrismaClient(),
      superfluidClient: new SuperfluidClient(),
    };
    break;
  default:
    throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
}

export default InitialState;
