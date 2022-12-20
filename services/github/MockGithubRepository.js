import axios from 'axios';

class MockGithubRepository {
	constructor() { }

	setGraphqlHeaders = () => {
		return null;
	};
	async fetchIssue(orgName, repoName, issueId) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubIssues?id=${issueId}`)
				.then(result => {
					resolve(parseIssueData(result.data, reject));
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
			axios.get(`http://localhost:3030/githubIssues?id=${issueId}`)
				.then(result => {
					resolve(this.parseIssueData(result.data[0], reject));
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

  async fetchUserByLogin(login) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubOrganizations?login=${login}`)
				.then(result => {
					resolve(result.data[0]);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
  }	

 async getPrs() {
 const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubPrs`)
				.then(result => {

					resolve(result);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
  }

	async fetchIssueByUrl(issueUrl) {
		const promise = new Promise((resolve, reject) => {
			axios.get(`http://localhost:3030/githubIssues?url=${issueUrl}`)
				.then(result => {

					resolve(result.data[0]);
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	  parseIssueData(rawIssueResponse, reject) {

      const responseData = rawIssueResponse;
      const timelineItems = responseData.timelineItems.nodes;
      const prs = timelineItems.filter((event) => event?.source?.__typename === 'PullRequest');
      const closedEvents = timelineItems.filter((event) => event?.__typename === 'ClosedEvent');
      const closedAt = responseData.closedAt;
      const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = responseData;
      const repoName = responseData.repository.name;
      const avatarUrl = responseData.repository.owner.avatarUrl;
      const owner = responseData.repository.owner.login;
      const twitterUsername = responseData.repository.owner.twitterUsername || null;
      const labels = responseData.labels.edges.map((edge) => edge.node);
      const number = responseData.number;
      const assignees = responseData.assignees.nodes;
      return {
        id,
        title,
        assignees,
        body,
        url,
        repoName,
        closedAt,
        owner,
        avatarUrl,
        labels,
        createdAt,
        closed,
        bodyHTML,
        titleHTML,
        twitterUsername,
        number,
        prs,
        closedEvents,
      };
   
    }
  

	
  parseIssuesData(rawIssuesResponse, reject) {
    const responseData = rawIssuesResponse;
    return responseData
      .filter((event) => event?.__typename === 'Issue')
      .map((elem) => {
        
          const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = elem;
          const repoName = elem.repository.name;
          const prs = elem.timelineItems.nodes.map((edge) => edge.node);
          const avatarUrl = elem.repository.owner.avatarUrl;
          const owner = elem.repository.owner.login;
          const repoDescription = elem.repository.description;
          const repoUrl = elem.repository.url;
          const assignees = elem.assignees.nodes;
          const number = elem.number;
          const labels = elem.labels.edges.map((edge) => edge.node);
          const languages = elem.repository.languages.edges.map((languages) => languages.node);
          return {
            id,
            title,
            body,
            url,
            languages,
            repoName,
            owner,
            avatarUrl,
            labels,
            createdAt,
            closed,
            bodyHTML,
            titleHTML,
            assignees,
            number,
            repoUrl,
            repoDescription,
            prs,
          };
        
      });
  }

	async getIssueData(issueIds) {
		const promise = new Promise((resolve, reject) => {
		
			axios.get('http://localhost:3030/githubIssues')
				.then(result => {
					resolve(this.parseIssuesData(result.data));
				})
				.catch(error => {
					reject(error);
				});
		});

		return promise;
	}

	getLeanIssueData () {
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
			axios.get(`http://localhost:3030/githubOrganizations?id=${id}`)
				.then(result => {
					resolve(result.data[0]);
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

	async fetchOrganizationsByIds(ids) {
		const promise = await new Promise(async (resolve, reject) => {
			try {
				const organizations = await Promise.all(ids.map(async (id, index) => {
					return await this.fetchOrgOrUserById(id);
				}));
				resolve(organizations);
			}
			catch (err) {
				reject(err);
			}

		});
		return promise;

	}

	async searchOrgOrUser (ids) {
		const promise = await new Promise(async (resolve, reject) => {
			try {
				const organizations = await Promise.all(ids.map(async (id, index) => {
					return await this.fetchOrgOrUserById(id);
				}));
				resolve(organizations);
			}
			catch (err) {
				reject(err);
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

	async fetchOrgsWithIssues(issueIds) {

		const promise = new Promise(async (resolve, reject) => {
			axios.get(`http://localhost:3030/githubIssues`)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
		return promise
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
export default MockGithubRepository;
