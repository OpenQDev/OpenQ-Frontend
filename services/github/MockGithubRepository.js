import axios from 'axios';

class MockGithubRepository {
	constructor() { }

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
