import axios from 'axios';

class MockAuthService {
	
	constructor() { }

	async hasSignature(library) {
		await sleep();

		return axios.get(`http://localhost:3030/hasSignature`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}
	async checkAuth(account) {
		await sleep();

		return axios.get(`http://localhost:3030/checkAuth`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async verifySignature(account) {
		await sleep();

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