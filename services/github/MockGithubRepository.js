import axios from 'axios';

class MockGithubRepository {
	constructor() { }

	async fetchIssue(orgName, repoName, issueId) {
		return axios.get(`http://localhost:3030/fetchIssue/${issueId}`)
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	}

	async fetchIssueById(issueId) {
		return axios.get(`http://localhost:3030/getIssueData/${issueId}`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.log(error);
			});
	}

	async fetchAvatarUrl() {
		return 'http://google.com';
	}

	async getIssueData() {
		return axios.get('http://localhost:3030/getIssueData')
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}
}

export default MockGithubRepository;
