import axios from "axios";
class OpenQPrismaClient {
    constructor(mockMutations) {
        this.mockMutations = mockMutations;
    }

    async getPaginatedTVLS(id, startAt, order, first) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/tvl`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }

    async updateUser(value) {
        try {
            const promise = new Promise(async (resolve, reject) => {

                axios.get(`http://localhost:3030/prismaUsers`)
                    .then(result => {
                        this.mockMutations.updateUserMockFunc(value);

                        resolve({ updateUser: result.data[0] });
                    })
                    .catch(error => {
                        reject(error);
                    });

            });
            return promise;
        } catch (e) {
            console.log("error", e);
        }

    }

    getOrgMetadata() {
        const promise = new Promise(async (resolve,) => {
            resolve({});
        });
        return promise;
    }


    getOrganizations() {
        const promise = new Promise(async (resolve,) => {
            axios.get(`http://localhost:3030/prismaOrgs`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }

    getLeanOrganizations() {
        const promise = new Promise(async (resolve,) => {
            axios.get(`http://localhost:3030/prismaOrgs`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;

    }


    getOrganization(id) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/prismaOrgs/`)
                .then(result => {
                    resolve({ organization: result.data.organizations.filter(org => org.id === id)[0] });
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    };

    async getContractPage(after, limit, sortOrder, orderBy, category, organizationId) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/prismaBounties`)
                .then(result => {
                    resolve(result.data.bounties);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }

    async getAllContracts(after, limit, sortOrder, orderBy, category, organizationId) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/prismaBounties`)
                .then(result => {
                    resolve(result.data.bounties.bountyConnection);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }


    getBlackListed(addresses) {
        const promise = new Promise(async (resolve,) => {
            resolve(addresses.map(address => { return { address }; }));
        });
        return promise;
    }

    async watchBounty(contractAddress, userAddress) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/tokenPrice`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }

    async getPr() {
        const promise = new Promise(async (resolve, reject) => {
            return { pr: null };
        });
        return promise;
    }

    async unWatchBounty(contractAddress, userAddress) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/tokenPrice`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }


    async getBounty(contractAddress) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/prismaBounty`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        }
        );
        return promise;
    }
    async getUser(userAddress) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/watchedBounties`)
                .then(result => {
                    resolve({ watchedBounties: result.data });
                })
                .catch(error => {
                    reject(error);
                });
        }
        );
        return promise;
    }
    async getUsers(apiSecret) {
        const promise = new Promise(async (resolve, reject) => {
            axios.get(`http://localhost:3030/prismaUsers`)
                .then(result => {
                    if (apiSecret === "testSecret") {
                        resolve(result.data);
                    }
                    else reject();
                })
                .catch(error => {
                    reject(error);
                });
        }
        );
        return promise;
    }


    async blacklistOrg() {
        return new Promise(async (resolve, reject) => {

            axios.get(`http://localhost:3030/watchedBounties`)
                .then(result => {
                    resolve({ watchedBounties: result.data });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async blacklistIssue() {
        return new Promise(async (resolve, reject) => {

            axios.get(`http://localhost:3030/watchedBounties`)
                .then(result => {
                    resolve({ watchedBounties: result.data });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

      async getProAccounts() {
    return new Promise(async (resolve, reject) => {
           axios.get(`http://localhost:3030/proaccounts`)
                .then(result => {
                    resolve({ proAccounts: result.data });
                })
                .catch(error => {
                    reject(error);
                });
    });
  }

  async getProducts() {
    return new Promise(async (resolve, reject) => {
         axios.get(`http://localhost:3030/products`)
                .then(result => {
                    resolve(result.data );
                })
                .catch(error => {
                    reject(error);
                });
    });
  }
  async createProduct(secret, variables) {
    return new Promise(async (resolve, reject) => {
         axios.get(`http://localhost:3030/products`)
                .then(result => {
                    resolve({ createProduct: result.data });
                })
                .catch(error => {
                    reject(error);
                });
    });
  }

  updateProduct(secret, variables) {
    return new Promise(async (resolve, reject) => {
           axios.get(`http://localhost:3030/products`)
                .then(result => {
                    resolve({ updateProduct: result.data });
                })
                .catch(error => {
                    reject(error);
                });
    });
  }
  addProductToProAccount(secret, variables) {
    return new Promise(async (resolve, reject) => {
          axios.get(`http://localhost:3030/proaccount`)
                .then(result => {
                    resolve({ addProductToProAccount: result.data });
                })
                .catch(error => {
                    reject(error);
                });
    });
  }
}

export default OpenQPrismaClient;
