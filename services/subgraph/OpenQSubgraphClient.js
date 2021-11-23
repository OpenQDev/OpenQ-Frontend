import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { GET_ISSUE } from './graphql/query';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';

class OpenQSubgraphClient {
	constructor() { }

	httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_URL, fetch });

	authLink = setContext((_, { headers }) => {
		const token = process.env.NEXT_PUBLIC_PAT;
		return {
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
		};
	});

	client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_OPENQ_SUBGRAPH_URL,
		link: this.authLink.concat(this.httpLink),
		cache: new InMemoryCache(),
	});

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
