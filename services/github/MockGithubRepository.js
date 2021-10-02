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
                    url: "sdf",
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
                            avatarUrl: "sdf"
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
                    avatarUrl: "sdf"
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
