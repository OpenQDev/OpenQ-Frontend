import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_ORGANIZATION, GET_USER, GET_BOUNTY, GET_BOUNTY_BY_ID, GET_ALL_BOUNTIES, GET_ORGANIZATIONS, GET_PAYOUT_TRANSACTION_HASH, GET_PAGINATED_ORGANIZATION_DATA } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQSubgraphClient {
	constructor() { }

	httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_HTTP_URL, fetch });

	client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_URL,
		link: this.httpLink,
		cache: new InMemoryCache()
	});

	async getAllBounties(sortOrder, startAt, quantity) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ALL_BOUNTIES,
					variables: {skip: startAt, sortOrder, quantity}
				});
				resolve(result.data.bounties);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getPayoutTransactionHash(bountyAddress) {
		const lowerCasedAddress = bountyAddress.toLowerCase();
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_PAYOUT_TRANSACTION_HASH,
					variables: { bountyAddress: lowerCasedAddress },
				});
				resolve(result.data.payouts[0].transactionHash);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getBounty(id, fetchPolicy = 'cache-first') {
		const lowerCasedAddress = id.toLowerCase();
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTY,
					variables: { id: lowerCasedAddress },
					fetchPolicy
				});
				resolve(result.data.bounty);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getBountyByBountyId(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTY_BY_ID,
					variables: { id }
				});
				resolve(result.data.bounties[0] ? result.data.bounties[0] : null);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getUser(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USER,
					variables: { id }
				});
				resolve(result.data.user);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getOrganizations() {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGANIZATIONS,
				});
				resolve(result.data.organizations);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getOrganization(id, quantity) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGANIZATION,
					variables: { id, quantity }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getPaginatedOrganizationBounties(id, startAt, order, first) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_PAGINATED_ORGANIZATION_DATA,
					variables: { id, skip: startAt, order, first  }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}
}

export default OpenQSubgraphClient;
