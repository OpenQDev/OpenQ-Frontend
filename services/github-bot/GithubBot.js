import axios from 'axios';

class GithubBot {
	constructor() { }

	// expects { bountyId } in body.
	async created(body) {
		const promise = new Promise((resolve, reject) => {
			axios.post(`${process.env.NEXT_PUBLIC_GITHUB_BOT_WEBHOOK}/created`, body, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
				}
			})
				.then((result) => {
					resolve(result);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	// expects { bountyId, data: {deposit: {tokenAddress, tokenVolumes}} } in body.
	async funded(body) {
		const promise = new Promise((resolve, reject) => {
			axios.post(`${process.env.NEXT_PUBLIC_GITHUB_BOT_WEBHOOK}/funded`, body)
				.then((result) => {
					resolve(result);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	// expects { bountyId, data: {deposit: {tokenAddress, tokenVolumes}} } in body.
	async refunded(body) {
		const promise = new Promise((resolve, reject) => {
			axios.post(`${process.env.NEXT_PUBLIC_GITHUB_BOT_WEBHOOK}/refunded`, body)
				.then((result) => {
					resolve(result);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}
}

export default GithubBot;
