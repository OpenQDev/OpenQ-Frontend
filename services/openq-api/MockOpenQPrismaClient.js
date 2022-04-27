class MockOpenQPrismaClient {
	constructor() { }

	async getPaginatedTVLS(id, startAt, order, first) {
		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/tvls`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise;
	}

}


export default MockOpenQPrismaClient;