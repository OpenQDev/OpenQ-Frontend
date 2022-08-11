import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_ORGANIZATION, GET_USER, GET_BOUNTY, GET_ALL_BOUNTIES, GET_ORGANIZATIONS, GET_PAYOUT_TRANSACTION_HASH, GET_PAGINATED_ORGANIZATION_DATA, GET_BOUNTY_BY_ID, GET_BOUNTIES_BY_CONTRACT_ADDRESSES, GET_ORGANIZATIONS_BY_IDS,  GET_LEAN_ORGANIZATIONS, GET_LEAN_BOUNTIES } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQSubgraphClient {
	constructor() { }

	uri = process.env.OPENQ_SUBGRAPH_SSR_HTTP_URL ? process.env.OPENQ_SUBGRAPH_SSR_HTTP_URL: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_HTTP_URL
	httpLink = new HttpLink({ uri: this.uri, fetch });

	client = new ApolloClient({
		uri: this.uri,
		link: this.httpLink,
		cache: new InMemoryCache()
	});

	async getAllBounties(sortOrder, startAt, quantity, types) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ALL_BOUNTIES,
					variables: { skip: startAt, sortOrder, quantity, types }
				});
				resolve(result.data.bounties.filter(bounty=>bounty.bountyId.slice(0, 1)==='I'||bounty.bountyId.slice(0, 1)==='M'));
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

	async getBountyByGithubId(id) {
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

	async getBountiesByContractAddresses(contractAddresses, types=['0','1','2']) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTIES_BY_CONTRACT_ADDRESSES,
					variables: { contractAddresses, types }
				});
				resolve(result.data.bounties);
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

	async getOrganizations(types) {
		console.log(types);
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGANIZATIONS,
					variables: {types}
				},
				);
				resolve(result.data.organizations);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getOrganizationsByIds(organizationIds) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGANIZATIONS_BY_IDS,
					variables: {organizationIds}
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
					variables: { id, skip: startAt, order, first }
				});
				resolve(result.data.organization.bountiesCreated);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async getBountyIds() {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_LEAN_BOUNTIES,
				});
				resolve(result.data.bounties);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async getOrganizationIds() {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_LEAN_ORGANIZATIONS,
				});
				resolve(result.data);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

}


export default OpenQSubgraphClient;
