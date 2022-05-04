class MockGithubBot {
	constructor() { }


	// expects { bountyId } in body.
	async created() {
		const promise = new Promise((resolve, reject) => {
			resolve();
		});
		return promise;
	}


	// expects { bountyId, data: {deposit: {tokenAddress, tokenVolumes}} } in body.

	async funded() {
		const promise = new Promise((resolve, reject) => {
			resolve();
		});
		return promise;
	}




	// expects { bountyId, data: {deposit: {tokenAddress, tokenVolumes}} } in body.

	async refunded() {
		const promise = new Promise((resolve, reject) => {
			resolve();
		});
		return promise;
	}


}





export default MockGithubBot;