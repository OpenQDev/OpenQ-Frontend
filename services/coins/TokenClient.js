import axios from 'axios';

class CoinClient {
	constructor() { }

	async getTokenValues(tokenVolumes, url) {
		const promise = new Promise((resolve, reject) => {
			axios.post(url, tokenVolumes)
				.then((result) => {
					resolve({ ...result.data });
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}
}

export default CoinClient;
