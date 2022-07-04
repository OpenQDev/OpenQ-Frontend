import GithubRepository from './GithubRepository';
import MockGithubRepository from './MockGithubRepository';

class WrappedGithubClient {
	constructor() {
		switch (process.env.DEPLOY_ENV) {
		case 'local':
			this.instance = new MockGithubRepository();
			break;
		case 'docker':
			this.instance = new GithubRepository();
			break;
		case 'development':
			this.instance = new GithubRepository();
			break;
		case 'staging':
			this.instance = new GithubRepository();
			break;
		case 'production':
			this.instance = new GithubRepository();
			break;
		case 'bcnhack':
			this.instance = new GithubRepository();
			break;
		default:
			throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
		}
	}
}

export default WrappedGithubClient;
