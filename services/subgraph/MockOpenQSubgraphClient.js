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
					resolve (null)
				});
		});

		return promise;
	}
	async getBountiesByContractAddresses(contractAddresses) {
		const promise = new Promise((resolve, reject) => {
		axios.get(`http://localhost:3030/bounties`)
				.then(result => {
					resolve(result.data.filter(bounty=>contractAddresses.includes(bounty.bountyAddress)));
				})
				.catch(error => {
					resolve (null)
				});
				});
		return promise
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

	async getOrganizationIds() {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/organizations')
				.then(result => {
					resolve({organizations: result.data});
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

		async getBountyIds(sortOrder, startAt=0, quantity=4) {
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

	
  getCoreValueMetrics({ currentTimestamp, previousTimestamp }) {
  return new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/bounties`)
				.then(result => {
				const coreMetrics = {
				previousClaims: result.data[0].payouts,
				previousDeposits: result.data[0].deposits,
				currentClaims: result.data[1].payouts,
				currentDeposits: result.data[1].deposits
				
				
				} 

					resolve(coreMetrics);
				})
				.catch(error => {
					resolve (null)
				});
				
		});/*
    return new Promise(async (resolve, reject) => {
      let currentDeposits, currentClaims, totalBalances;
      try {
        const result = await this.client.query({
          query: GET_CORE_VALUE_METRICS_CURRENT,
          variables: { currentTimestamp },
        });
        console.log(result.data);
        currentDeposits = result.data.deposits;
        currentClaims = result.data.payouts;
        totalBalances = result.data.bountyFundedTokenBalances;
      } catch (err) {
        reject(err);
      }
      let previousDeposits, previousClaims;
      try {
        const result = await this.client.query({
          query: GET_CORE_VALUE_METRICS_HISTORIC,
          variables: { currentTimestamp, previousTimestamp },
        });
        console.log(result.data);
        previousDeposits = result.data.deposits;
        previousClaims = result.data.payouts;
      } catch (err) {
        reject(err);
      }
      resolve({ currentDeposits, currentClaims, totalBalances, previousDeposits, previousClaims });
    });*/
  }
}

export default MockOpenQSubgraphClient;
