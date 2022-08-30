import axios from 'axios';

class MockAuthService {
	
	constructor() { }

	async sleep(time) {
		return new Promise(async (resolve,) => {
			return setTimeout(resolve, time);
		});
	}
	async hasSignature(library) {
		await this.sleep();

		return axios.get(`http://localhost:3030/hasSignature`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}
	async checkAuth(account) {
		await this.sleep();

		return axios.get(`http://localhost:3030/checkAuth`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async verifySignature(account) {
		await this.sleep();

		return axios.get(`http://localhost:3030/verifySignature`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

}

export default MockAuthService