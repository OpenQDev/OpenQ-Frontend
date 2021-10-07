import GithubRepository from "../../services/github/GithubRepository";
import MockGithubRepository from "../../services/github/MockGithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";
import Utils from "../../services/utils/Utils";
import OpenQClient from '../../services/ethers/OpenQClient';
import MockOpenQClient from "../../services/ethers/MockOpenQClient";
import { ethers } from 'ethers';

let InitialState = {};
switch (process.env.DEPLOY_ENV) {
    // Booting mock will spin up A) an Ethnode B) a frontend to which we inject all mocks
    case "mock":
        console.log(process.env.FAKE_TOKEN_ADDRESS);
        InitialState = {
            githubRepository: new MockGithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQAddress: process.env.OPENQ_ADDRESS,
            openQClient: new MockOpenQClient(),
            baseUrl: "http://localhost",
            frontendPort: ":3000",
            oauthPort: "",
            githubOAuthPath: "auth"
        };
        break;
    // Booting local will sping up A) an Ethnode B) deploy contracts C) boot API D) boot frontend to point to all three of the former
    case "local":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQAddress: process.env.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "http://localhost",
            frontendPort: ":3000",
            oauthPort: ":3001",
            githubOAuthPath: ""
        };
        break;
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQAddress: process.env.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "https://development.openq.dev",
            frontendPort: "",
            oauthPort: "",
            githubOAuthPath: "auth"
        };
        break;
    case "staging":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQAddress: process.env.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "https://staging.openq.dev",
            frontendPort: "",
            oauthPort: "",
            githubOAuthPath: "auth"
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQAddress: process.env.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
            baseUrl: "https://app.openq.dev",
            frontendPort: "",
            oauthPort: "",
            githubOAuthPath: "auth"
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV`);
}

export default InitialState;