import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_PAGINATED_TVLS, CREATE_NEW_BOUNTY } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQPrismaClient {
	constructor() { }

	httpLink = new HttpLink({ uri: 'https://api.github.com/graphql', fetch });

	client = new ApolloClient({
		uri: 'https://api.github.com/graphql',
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

	async createNewBounty(  bountyId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { bountyId, tvl:0.0 }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async updateBounty(bountyId, tvl ) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { bountyId, tvl }
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
