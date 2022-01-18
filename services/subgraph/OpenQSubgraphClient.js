import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_ORGANIZATION, GET_USER, GET_BOUNTY, GET_BOUNTY_BY_ID, GET_ALL_BOUNTIES, GET_ORGANIZATIONS } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQSubgraphClient {
	constructor() { }

	httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_HTTP_URL, fetch });

	client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_URL,
		link: this.httpLink,
		cache: new InMemoryCache(),
	});

	async getAllBounties() {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ALL_BOUNTIES,
				});
				resolve(result.data.bounties);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getBounty(id) {
		const lowerCasedAddress = id.toLowerCase();
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTY,
					variables: { id: lowerCasedAddress }
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

	async getOrganization(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGANIZATION,
					variables: { id }
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
