import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { CREATE_NEW_BOUNTY, UPDATE_BOUNTY, WATCH_BOUNTY, UNWATCH_BOUNTY, GET_BOUNTY_BY_HASH, GET_USER_BY_HASH, GET_BOUNTY_PAGE } from './graphql/query';
import fetch from 'cross-fetch';
import { ethers } from 'ethers';

class OpenQPrismaClient {
	constructor() { }
	uri = process.env.OPENQ_API_SSR_URL ? process.env.OPENQ_API_SSR_URL : process.env.NEXT_PUBLIC_OPENQ_API_URL;
	httpLink = new HttpLink({ uri: this.uri, fetch });

	client = new ApolloClient({
		uri: this.uri + '/graphql',
		link: this.httpLink,
		cache: new InMemoryCache(),
	});

	async watchBounty(contractAddress, userAddress, signature) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: WATCH_BOUNTY,
					variables: { contractAddress, userAddress, signature }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async unWatchBounty(contractAddress, userAddress, signature) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: UNWATCH_BOUNTY,
					variables: { contractAddress, userAddress, signature }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async getBounty(contractAddress) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTY_BY_HASH,
					variables: { contractAddress: ethers.utils.getAddress(contractAddress) }
				});
				resolve(result.data.bounty);
			}
			catch (e) {
				reject(e);
			}
		}
		);
		return promise;
	}

	async getUser(userAddress) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USER_BY_HASH,
					variables: { userAddress: ethers.utils.getAddress(userAddress) }
				});
				resolve(result.data.user);
			}
			catch (e) {
				reject(e);
			}
		}
		);
		return promise;
	}

	async getBountyPage(after, limit, orderBy, sortOrder, organizationId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_BOUNTY_PAGE,
					variables: { after, limit, orderBy, sortOrder, organizationId },
					fetchPolicy: 'no-cache'
				});
				resolve(result.data);
			}
			catch (e) {
				reject(e);
			}
		}
		);
		return promise;
	}
}

export default OpenQPrismaClient;
