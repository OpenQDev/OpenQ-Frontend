import axios from 'axios';

class MockGithubRepository {
	constructor() { }

	setGraphqlHeaders = () => {
		return null
	}
	async fetchIssue(orgName, repoName, issueId) {
		const id = 'sdfsd';
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubIssues/abc123`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async fetchOrganizationByName(orgName) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubOrganizations/${orgName}`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async fetchIssueById(issueId) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/fetchIssueById/${issueId}`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async fetchIssueByUrl(issueUrl) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/fetchIssueByUrl`)
				.then(result => {
					const issue = result.data.filter((issue)=>{
						return issue.url === issueUrl;

					})[0];
					resolve(issue);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

		parseIssueData(rawIssueResponse) {
		try {
			const responseData = rawIssueResponse.data.node;
			const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = responseData;
			const repoName = responseData.repository.name;
			const avatarUrl = responseData.repository.owner.avatarUrl;
			const owner = responseData.repository.owner.login;
			const twitterUsername = responseData.repository.owner.twitterUsername||null;
			const labels = responseData.labels.edges.map(edge => edge.node);
			const number = responseData.number;
			const assignees = responseData.assignees.nodes;
			return { id, title, assignees, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML, twitterUsername, number };
		}
		catch (err) {
			let id, title, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML, twitterUsername, number;
			return { id, title, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML, twitterUsername, number };
		}
	}

	parseIssuesData(rawIssuesResponse) {
		const responseData = rawIssuesResponse.data.nodes;
		return responseData.filter(event => event?.__typename === 'Issue').map((elem) => {
			try {
				const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = elem;
				const repoName = elem.repository.name;
				const avatarUrl = elem.repository.owner.avatarUrl;
				const owner = elem.repository.owner.login;
				const assignees = elem.assignees;
				const labels = elem.labels.edges.map(edge => edge.node);
				const languages = elem.repository.languages.edges.map(languages => languages.node);
				return { id, title, body, url, languages, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML, assignees };
			}

			catch (err) {
				console.log(err);
				let id, url, repoName, owner, avatarUrl, labels, createdAt, closed, titleHTML, assignees;
				return { id, assignees, url, repoName, owner, avatarUrl, labels, createdAt, closed, titleHTML, bodyHTML: '', };
			}
		}
		);
	}

	async getIssueData(issueIds) {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/githubIssues')
				.then(result => {
				console.log(this.parseIssuesData(result))
				resolve(this.parseIssuesData(result).filter((issue)=>issueIds.includes(issue.id)));
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}
	
	async fetchOrgOrUserById(id) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubOrganizations/?organization=${organization}`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	fetchOrgOrUserByLogin(organization) {
	
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubOrganizations?login=${organization}`)
				.then(result => {
					resolve(result.data[0]);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async fetchOrgsOrUsersByIds(ids){
		const promise= new Promise((resolve, reject) => {
		try{
		const orgPromises = Promise.all( ids.map(async(id)=>{
			return await this.fetchOrgOrUserById(id);
		}))
		resolve(orgPromises)
	}
		catch(err){
			console.log(err);
			reject(err)
		}

	})
	return promise;

}
}
export default MockGithubRepository;
