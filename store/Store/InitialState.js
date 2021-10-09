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
            apiPort: ":8090",
            oauthPort: "",
            githubOAuthPath: "auth",
            clientId: "doesntmatter"
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
            apiPort: ":8090",
            githubOAuthPath: "",
            clientId: "5fbd39c6916b7efb63cc"
        };
        break;
<<<<<<< Updated upstream
    case "development":
=======
    case "docker":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQAddress: process.env.OPENQ_ADDRESS,
            openQClient: new OpenQClient(),
        };
        break;
    // Booting mock will spin up A) an Ethnode B) a frontend to which we inject all mocks
    case "mock":
        console.log(process.env.FAKE_TOKEN_ADDRESS);
>>>>>>> Stashed changes
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
            apiPort: "",
            githubOAuthPath: "auth",
            clientId: "82e208319d33d8a6f6b8"
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
            apiPort: "",
            githubOAuthPath: "auth",
            clientId: "6fef986c27015da76128"
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
            apiPort: "",
            githubOAuthPath: "auth",
            clientId: "79c2b8f305ad223cfb5e"
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV`);
}

export default InitialState;