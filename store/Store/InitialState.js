import GithubRepository from "../../services/GithubRepository/GithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";
import Utils from "../../services/utils/Utils";
import OpenQ from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';
import ERC20 from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

let InitialState = {};

switch ("local") {
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            openQAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            OpenQ,
            ERC20
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            openQAddress: process.env.OPENQ_ADDRESS,
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            OpenQ,
            ERC20
        };
        break;
    case "local":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            openQAddress: process.env.OPENQ_ADDRESS,
            tokenAddresses: [process.env.FAKE_TOKEN_ADDRESS, process.env.MOCK_TOKEN_ADDRESS],
            OpenQ,
            ERC20
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment`);
}

export default InitialState;