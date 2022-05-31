import axios from "axios";
class OpenQPrismaClient {
	constructor() { }

	async getPaginatedTVLS(id, startAt, order, first) {
		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/tvl`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise;
	}


	async createNewBounty(id) {
		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/tvl`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise;
	}

	async updateBounty(id, tvl ) {
		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/tvl`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise;
	}

	async watchBounty(contractAddress, userAddress ) {
		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/tvl`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise;
	}

	async unWatchBounty(contractAddress, userAddress ) {
		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/tvl`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise;
	}


	async getBounty(contractAddress) {
		const promise = new Promise(async (resolve, reject)=>{
			axios.get(`http://localhost:3030/prismaBounty`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		}
		);
		return promise;
	}
	async getUser(userAddress) {
		const promise = new Promise(async (resolve, reject)=>{
			axios.get(`http://localhost:3030/user`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		}
		);
		return promise;
	}
}

export default OpenQPrismaClient;
