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
	
	async fetchOrgOrUserById(id) {
	
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubOrganizations/${id}`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	fetchOrgOrUserByLogin(id) {
	
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubOrganizations/${id}`)
				.then(result => {
					resolve(result.data);
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
