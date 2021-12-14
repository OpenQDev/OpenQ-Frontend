import axios from 'axios';

class MockGithubRepository {
	constructor() { }

	async fetchIssue(orgName, repoName, issueId) {
		// just return any old issue
		const id = 'sdfsd';
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubIssuesById/${id}`)
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
			axios.get(`http://localhost:3030/githubIssues/${issueId}`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	async fetchAvatarUrl() {
		return 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4';
	}

	async getIssueData() {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/githubIssues')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}
}

export default MockGithubRepository;
