import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_PAGINATED_TVLS } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQPrismaClient {
	constructor() { }

	httpLink = new HttpLink({ uri: 'https://api.github.com/graphql', fetch });

	client = new ApolloClient({
		uri: 'https://api.github.com/graphql',
		link: this.httpLink,
		cache: new InMemoryCache(),
	});


	async getPaginatedTVLS(id, startAt, order, first) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_PAGINATED_TVLS,
					variables: { id, skip: startAt, order, first }
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
