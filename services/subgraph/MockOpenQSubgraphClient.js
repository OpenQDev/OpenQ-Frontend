import axios from 'axios';

class MockOpenQSubgraphClient {
	constructor() { }

	async getAllBounties(sortOrder, startAt, quantity) {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/bounties')
				.then(result => {
					resolve(result.data.slice(startAt, quantity));
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async getBounty(id) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/bounties?bountyAddress=${id}`)
				.then(result => {
					resolve(result.data[0]);
				})
				.catch(error => {
				console.log(error)
					resolve (null)
				});
		});

		return promise;
	}

	async getBountyByGithubId(id) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/bounties?bountyId=${id}`)
				.then(result => {
					resolve(result.data[0])
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async getUser(id) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/users/${id}`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async getOrganizations() {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/organizations')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async getOrganization(id) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/organizations/${id}`)
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

export default MockOpenQSubgraphClient;
