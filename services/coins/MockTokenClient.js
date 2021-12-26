import axios from 'axios';

class MockCoinClient {
	constructor() { }

	async getTokenValues() {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/tvl')
				.then((result) => {
					resolve(result.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}
}

export default MockCoinClient;
