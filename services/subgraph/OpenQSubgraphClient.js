import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GET_BOUNTY, GET_ALL_BOUNTIES, SUBSCRIBE_TO_BOUNTY } from './graphql/query';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';

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
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTY,
					variables: { id }
				});
				resolve(result.data.bounty);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchIssue(orgName, repoName, issueId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUE, variables: { orgName, repoName, issueId },
				});
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}
}

export default OpenQSubgraphClient;
