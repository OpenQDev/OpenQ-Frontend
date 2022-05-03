import axios from 'axios';

class GithubBot {
	constructor() { }


	// expects { bountyId } in body.
	async created(body) {
		const promise = new Promise((resolve, reject) => {
			axios.post(`${'http://localhost:3006'}/openq-bot/created`, body)
				.then((result) => {
					resolve( result );
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
			console.log(body);
			axios.post(`${'http://localhost:3006'}/openq-bot/funded`, body)
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
			axios.post(`${'http://localhost:3006'}/openq-bot/refunded`, body)
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
