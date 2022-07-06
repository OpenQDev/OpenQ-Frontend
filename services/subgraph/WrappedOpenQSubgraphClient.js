import OpenQSubgraphClient from './OpenQSubgraphClient';
import MockOpenQSubgraphClient from './MockOpenQSubgraphClient';

class WrappedOpenQSubgraphClient {
	constructor() {
		switch (process.env.DEPLOY_ENV) {
			case 'local':
				this.instance = new MockOpenQSubgraphClient();
				break;
			case 'docker':
				this.instance = new OpenQSubgraphClient();
				break;
			case 'development':
				this.instance = new OpenQSubgraphClient();
				break;
			case 'staging':
				this.instance = new OpenQSubgraphClient();
				break;
			case 'production':
				this.instance = new OpenQSubgraphClient();
				break;
			default:
				throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
		}
	}
}

export default WrappedOpenQSubgraphClient;
