import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_USER_BY_ID, GET_USER_BY_NAME, GET_ORG_BY_ID, GET_ORG_BY_NAME, GET_ISSUE, GET_ISSUE_BY_ID, GET_ISSUES_BY_ID, GET_ORGS_BY_ISSUES, GET_ORGS_BY_IDS, GET_USERS_BY_IDS } from './graphql/query';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';

class GithubRepository {
	constructor() {
		console.log('process.env.PATS', process.env.PATS)
	 }

	httpLink = new HttpLink({ uri: 'https://api.github.com/graphql', fetch });

	authLink = setContext((_, { headers }) => {
		// let patsArray = process.env.PATS.split(',');
		// let token = patsArray[Math.floor(Math.random() * patsArray.length)];
		return {
			headers: {
				...headers,
				Authorization: `Bearer ${process.env.NEXT_}`,
			},
		};
	});

	client = new ApolloClient({
		uri: 'https://api.github.com/graphql',
		link: this.authLink.concat(this.httpLink),
		cache: new InMemoryCache(),
	});

	async fetchIssueByUrl(issueUrl) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUE, variables: { issueUrl },
				});
				resolve(result.data.resource);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	parseIssueData(rawIssueResponse) {
		const responseData = rawIssueResponse.data.node;
		const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = responseData;
		const repoName = responseData.repository.name;
		const avatarUrl = responseData.repository.owner.avatarUrl;
		const owner = responseData.repository.owner.login;
		const twitterUsername = responseData.repository.owner.twitterUsername;
		const labels = responseData.labels.edges.map(edge => edge.node);
		const number = responseData.number;
		return { id, title, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML, twitterUsername, number };
	}
	parseIssuesData(rawIssuesResponse) {
		const responseData = rawIssuesResponse.data.nodes;
		return responseData.map((elem) => {

			const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = elem;
			const repoName = elem.repository.name;
			const avatarUrl = elem.repository.owner.avatarUrl;
			const owner = elem.repository.owner.login;
			const labels = elem.labels.edges.map(edge => edge.node);
			return { id, title, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML };
		});
	}

	async fetchIssueById(issueId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUE_BY_ID, variables: { issueId },
				});
				resolve(this.parseIssueData(result));
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getIssueData(issueIds) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUES_BY_ID, variables: { issueIds },
				});
				resolve(this.parseIssuesData(result));
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgsWithIssues(issueIds) {

		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGS_BY_ISSUES, variables: { issueIds },
				});
				resolve(result.data.nodes);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgOrUserByLogin(login) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const organizationResult = await this.fetchOrganizationByLogin(login);
				resolve(organizationResult);
			} catch (e) {
				const userResult = await this.fetchUserByLogin(login);
				resolve(userResult);
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrganizationByLogin(login) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORG_BY_NAME, variables: { login },
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchUserByLogin(login) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USER_BY_NAME, variables: { login },
				});
				resolve(result.data.user);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgOrUserById(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const organizationResult = await this.fetchOrganizationById(id);
				if (organizationResult.__typename == 'Organization') {
					resolve(organizationResult);
				} else {
					const userResult = await this.fetchUserById(id);
					resolve(userResult);
				}
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgsOrUsersByIds(ids) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const orgString = 'MDEyO';
				const userString = 'MDQ6V';
				const orgIds = [];
				const userIds = [];
				const unknownIds = [];
				ids.forEach(id => {
					if (id.slice(0, 5) === orgString) {
						orgIds.push(id);
					}
					else if (id.slice(0, 5) === userString) {
						userIds.push(id);
					}
					else unknownIds.push(id);
				});
				const organizations = await this.fetchOrganizationsByIds(orgIds);
				const users = await this.fetchUsersByIds(userIds);
				const unknown = [];
				for (const id of unknownIds) {
					const data = await this.fetchOrgOrUserById(id);
					unknown.push(data);
				}
				resolve([...users, ...organizations, ...unknown]);
			}
			catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchUserById(userId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USER_BY_ID, variables: { userId },
				});
				resolve(result.data.node);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchUsersByIds(userIds) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USERS_BY_IDS, variables: { userIds },
				});
				resolve(result.data.nodes);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
		return promise;
	}

	async fetchOrganizationById(orgId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORG_BY_ID, variables: { orgId },
				});
				resolve(result.data.node);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrganizationsByIds(orgIds) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGS_BY_IDS, variables: { orgIds },
				});
				resolve(result.data.nodes);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
		return promise;
	}

	async parseOrgIssues(issueIds) {
		const nodes = await this.fetchOrgsWithIssues(issueIds);
		const organizations = [];
		nodes.forEach((node) => {
			if (!organizations.some((organization => organization.login === node.repository.owner.login))) {
				organizations.push(node.repository.owner);
			}
		});
		return organizations;
	}
}


export default GithubRepository;
