import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_PAGINATED_TVLS, CREATE_NEW_BOUNTY, UPDATE_BOUNTY } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQPrismaClient {
	constructor() { }

	httpLink = new HttpLink({ uri: 'http://localhost:4000', fetch });

	client = new ApolloClient({
		uri: 'http://localhost:4000/graphql',
		link: this.httpLink,
		cache: new InMemoryCache(),
	});


	async getPaginatedTVLS( orderBy, limit, sortOrder, cursor) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_PAGINATED_TVLS,
					variables: { orderBy, limit, sortOrder, cursor }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async createNewBounty(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { id, tvl:0.0 }
				});
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async updateBounty(id, tvl ) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: UPDATE_BOUNTY,
					variables: { id, tvl }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}
}


export default OpenQPrismaClient;
