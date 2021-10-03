class MockGithubRepository {
    constructor() { }

    async fetchIssue(orgName, repoName, issueId) {
        const result = {
            data: {
                organization: {
                    name: "OpenQDev",
                    repository: {
                        name: "frontend",
                        issue: {
                            id: "mockid",
                            author: {
                                login: "alo9507"
                            },
                            createdAt: "12",
                            title: "issue title",
                            body: "issue body",
                        }
                    }
                }
            }
        };

        const promise = new Promise(async (resolve, reject) => {
            resolve(result);
        });

        return promise;
    }

    async fetchIssueById(issueId) {
        const result = {
            data: {
                node: {
                    title: "sdf",
                    body: "sdf",
                    url: "https://github.com/OpenQDev/frontend/issues/7",
                    labels: {
                        edges: [{
                            node: {
                                name: "solidity",
                                color: "sdfs"
                            }
                        }]
                    },
                    repository: {
                        id: "sdf",
                        name: "sdf",
                        owner: {
                            login: "alo9507",
                            avatarUrl: "https://avatars.githubusercontent.com/u/77402538?v=4"
                        }
                    }
                }
            }
        };

        const promise = new Promise(async (resolve, reject) => {
            resolve(result);
        });

        return promise;
    }

    async fetchAvatarUrl() {
        const result = {
            data: {
                viewer: {
                    avatarUrl: "https://avatars.githubusercontent.com/u/32375569?u=946349015cfa1195ef50b5bb33a952a546bbdc2d&v=4"
                }
            }
        };

        const promise = new Promise(async (resolve, reject) => {
            resolve(result);
        });

        return promise;
    }
}

export default MockGithubRepository;
