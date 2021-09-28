import GithubRepository from "../../services/GithubRepository/GithubRepository";
import AuthDataStore from "../../services/authentication/AuthDataStore";

let InitialState = {};

switch ("local") {
    case "development":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: ""
        };
        break;
    case "production":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: ""
        };
        break;
    case "local":
        InitialState = {
            githubRepository: new GithubRepository(),
            publicAddress: ""
        };
        break;
    default:
        throw Error(`ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment`);
}

export default InitialState;