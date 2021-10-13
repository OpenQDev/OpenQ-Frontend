import GithubRepository from "../../services/github/GithubRepository";
import MockGithubRepository from "../../services/github/MockGithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";
import Utils from "../../services/utils/Utils";
import OpenQClient from '../../services/ethers/OpenQClient';
import MockOpenQClient from "../../services/ethers/MockOpenQClient";
import { ethers } from 'ethers';
import addresses from '../../addresses/addresses.json';

let InitialState = {};
switch (process.env.DEPLOY_ENV) {
    case "mock":
        InitialState = {
            githubRepository: new MockGithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS],
            openQAddress: addresses.OPENQ_ADDRESS,
            openQClient: new MockOpenQClient(),
            baseUrl: "http://localhost",
            frontendPort: ":3000",
            apiPort: ":8090",
            oauthPort: "",
            githubOAuthPath: "oauth",
            clientId: "doesntmatter"
        };
        break;
    case "docker":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS],
            openQAddress: addresses.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "http://localhost",
            frontendPort: ":3000",
            oauthPort: ":3001",
            apiPort: ":8090",
            githubOAuthPath: "",
            clientId: "5fbd39c6916b7efb63cc"
        };
        break;
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS],
            openQAddress: addresses.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "https://development.openq.dev",
            frontendPort: "",
            oauthPort: "",
            apiPort: "",
            githubOAuthPath: "oauth",
            clientId: "82e208319d33d8a6f6b8"
        };
        break;
    case "staging":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS],
            openQAddress: addresses.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "https://staging.openq.dev",
            frontendPort: "",
            oauthPort: "",
            apiPort: "",
            githubOAuthPath: "oauth",
            clientId: "6fef986c27015da76128"
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS],
            openQAddress: addresses.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "https://app.openq.dev",
            frontendPort: "",
            oauthPort: "",
            apiPort: "",
            githubOAuthPath: "oauth",
            clientId: "79c2b8f305ad223cfb5e"
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV`);
}

export default InitialState;