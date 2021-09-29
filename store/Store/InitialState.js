import GithubRepository from "../../services/GithubRepository/GithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";
import Utils from "../../services/utils/Utils";
import OpenQ from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';

let InitialState = {};

switch ("local") {
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            openQAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            tokenAddresses: ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
            OpenQ
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            openQAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            tokenAddresses: ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
            OpenQ
        };
        break;
    case "local":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils(),
            openQAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            tokenAddresses: ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
            OpenQ
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment`);
}

export default InitialState;