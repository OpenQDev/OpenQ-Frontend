import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { GET_ALL_ISSUES } from './graphql/query';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';

class OpenQSubgraphClient {
	constructor() { }

	httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_URL, fetch });

	client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_URL,
		link: this.httpLink,
		cache: new InMemoryCache(),
	});

	async getAllIssues() {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ALL_ISSUES,
				});
				resolve(result.data.issues);
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
