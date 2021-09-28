import GithubRepository from "../../services/GithubRepository/GithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";
import Utils from "../../services/utils/Utils";

let InitialState = {};

switch ("local") {
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils()
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils()
        };
        break;
    case "local":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: "",
            utils: new Utils()
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment`);
}

export default InitialState;