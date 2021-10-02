import GithubRepository from "../../services/github/GithubRepository";
import MockGithubRepository from "../../services/github/MockGithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";
import Utils from "../../services/utils/Utils";
import OpenQClient from '../../services/ethers/OpenQClient';
import MockOpenQClient from "../../services/ethers/MockOpenQClient";

let InitialState = {};

switch ("local") {
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQClient: new OpenQClient(process.env.OPENQ_ADDRESS)
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQClient: new OpenQClient(process.env.OPENQ_ADDRESS)
        };
        break;
    case "local":
        InitialState = {
            githubRepository: new MockGithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            openQClient: new MockOpenQClient()
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment`);
}

export default InitialState;