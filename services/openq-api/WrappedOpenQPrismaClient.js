import OpenQPrismaClient from './OpenQPrismaClient';
import MockOpenQPrismaClient from './MockOpenQPrismaClient';

class WrappedOpenQPrismaClient {
	constructor() {
		switch (process.env.DEPLOY_ENV) {
		case 'local':
			this.instance = new MockOpenQPrismaClient();
			break;
		case 'docker':
			this.instance = new OpenQPrismaClient();
			break;
		case 'development':
			this.instance = new OpenQPrismaClient();
			break;
		case 'staging':
			this.instance = new OpenQPrismaClient();
			break;
		case 'production':
			this.instance = new OpenQPrismaClient();
			break;
		case 'bcnhack':
			this.instance = new OpenQPrismaClient();
			break;
		default:
			throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
		}
	}
}

export default WrappedOpenQPrismaClient;
