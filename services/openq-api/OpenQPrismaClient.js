import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import {
  WATCH_BOUNTY,
  UNWATCH_BOUNTY,
  GET_BOUNTY_BY_ADDRESS,
  GET_USER,
  GET_PRIVATE_USER,
  UPDATE_USER,
  UPSERT_USER,
  GET_CONTRACT_PAGE,
  GET_LEAN_ORGANIZATIONS,
  GET_ALL_CONTRACTS,
  GET_SUBMISSION_BY_ID,
  CREATE_PR,
  ADD_CONTRIBUTOR,
  REMOVE_CONTRIBUTOR,
  GET_ORGANIZATIONS,
  STAR_ORGANIZATION,
  UNSTAR_ORGANIZATION,
  GET_ORGANIZATION,
  BLACKLIST_ISSUE,
  BLACKLIST_ORGANIZATION,
  GET_USERS,
  UPDATE_REPOSITORY_AS_CONTEST,
  GET_REPOSITORIES,
  GET_REPOSITORY_BY_ID,
  GET_ALL_SUBMISSIONS,
  COMBINE_USERS,
  GET_REQUESTS,
  GET_PRIVATE_REQUEST,
  UPDATE_REQUEST,
  CREATE_PRO_ACCOUNT,
  GET_PRO_ACCOUNTS,
  GET_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRO_ACCOUNT,
  ADD_PRODUCT_TO_PRO_ACCOUNT,
  ADD_PRO_ACCOUNT_ADMIN,
  ADD_PRO_ACCOUNT_MEMBER,
  REMOVE_PRO_ACCOUNT_MEMBER,
  REMOVE_PRO_ACCOUNT_ADMIN,
  GET_PRO_ACCOUNT_INFO_CURRENT,
  GET_USERS_PAGE,
} from './graphql/query';
import { ethers } from 'ethers';

import { setContext } from '@apollo/client/link/context';

class OpenQPrismaClient {
  constructor() {}

  uri = process.env.OPENQ_API_SSR_URL ? process.env.OPENQ_API_SSR_URL : process.env.NEXT_PUBLIC_OPENQ_API_URL;
  httpLink = new HttpLink({ uri: this.uri, fetch, credentials: 'include' });

  client = new ApolloClient({
    uri: this.uri + '/graphql',
    link: this.httpLink,
    cache: new InMemoryCache(),
  });

  setGraphqlHeaders = (cookie) => {
    let authLink;
    authLink = setContext(() => {
      return {
        headers: {
          cookie,
        },
      };
    });

    this.client.setLink(authLink.concat(this.httpLink));
  };

  async watchBounty(contractAddress, idObj) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: WATCH_BOUNTY,
          variables: { contractAddress, ...idObj },
          fetchPolicy: 'no-cache',
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async unWatchBounty(contractAddress, idObj) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UNWATCH_BOUNTY,
          variables: { contractAddress, ...idObj },
          fetchPolicy: 'no-cache',
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async unStarOrg(variables) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UNSTAR_ORGANIZATION,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async starOrg(variables) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: STAR_ORGANIZATION,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async getProAccount(id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_PRO_ACCOUNT,
          variables: { id },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  removeProAccountRole = async (variables, role) => {
    if (role === 'admin' || role === 'adminUsers') {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const result = await this.client.mutate({
            mutation: REMOVE_PRO_ACCOUNT_ADMIN,
            variables,
          });
          resolve(result.data);
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    } else {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const result = await this.client.mutate({
            mutation: REMOVE_PRO_ACCOUNT_MEMBER,
            variables,
          });
          resolve(result.data);
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    }
  };

  addProAccountRole = async (variables, role) => {
    if (role === 'admin' || role === 'adminUsers') {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const result = await this.client.mutate({
            mutation: ADD_PRO_ACCOUNT_ADMIN,
            variables,
          });
          resolve(result.data);
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    } else {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const result = await this.client.mutate({
            mutation: ADD_PRO_ACCOUNT_MEMBER,
            variables,
          });
          resolve(result.data);
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    }
  };

  async getBounty(contractAddress) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_BOUNTY_BY_ADDRESS,
          variables: {
            contractAddress: ethers.utils.getAddress(contractAddress),
          },
        });
        resolve({
          ...result.data.bounty,
        });
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async getPr(id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_SUBMISSION_BY_ID,
          variables: { id },
          fetchPolicy: 'no-cache',
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }
  createPr(prId, bountyAddress, thumbnail) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: CREATE_PR,
          variables: { prId, bountyAddress, thumbnail },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getAllContracts() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_ALL_CONTRACTS,
        });
        resolve(result.data.bounties.nodes);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getOrganizations(types, batch, category) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = { types, batch, category };
      if (category) {
        variables.category = category;
      }
      try {
        const result = await this.client.mutate({
          mutation: GET_ORGANIZATIONS,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getSubmissions() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_ALL_SUBMISSIONS,
        });
        resolve(result.data.submissions);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getOrganization(id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: GET_ORGANIZATION,
          variables: { organizationId: id },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }
  // Good to go.
  getLeanOrganizations(organizationIds) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: GET_LEAN_ORGANIZATIONS,
          variables: { organizationIds },
        });
        resolve(result.data.organizations.nodes);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  updateUser(variables) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPDATE_USER,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  upsertUser() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPSERT_USER,
        });
        resolve(result.data.upsertUser);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  combineUsers(values) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: COMBINE_USERS,
          variables: values,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  updateLocalUser(values) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...user, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve({ updateUser: updatedUser });
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  addContributor(prId, userId, address) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: ADD_CONTRIBUTOR,
          variables: { prId, userId, address },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  removeContributor(prId, userId) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: REMOVE_CONTRIBUTOR,
          variables: { prId, userId },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async getUser(types, category) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {
        types,
      };
      if (category) {
        variables.category = category;
      }
      try {
        const result = await this.client.query({
          query: GET_PRIVATE_USER,
          variables,
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        });
        resolve(result.data.currentUser);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getProAccountInfoOfCurrent() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_PRO_ACCOUNT_INFO_CURRENT,
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        });
        resolve(result.data.currentUser);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getUserRequests(idObject, paginationVars) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {
        ...paginationVars,
      };

      if (idObject.id) {
        variables.id = idObject.id;
      }

      if (idObject.github) {
        variables.github = idObject.github;
      }

      if (idObject.email) {
        variables.email = idObject.email;
      }

      try {
        const result = await this.client.query({
          query: GET_REQUESTS,
          variables,

          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        });
        resolve(result.data.user);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getPrivateRequest(id) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {
        id,
      };

      try {
        const result = await this.client.query({
          query: GET_PRIVATE_REQUEST,
          variables,
        });
        resolve(result.data.request);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  updateRequest(variables) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPDATE_REQUEST,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getLocalUser() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        resolve(user);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getPublicUser(github, username) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {};
      if (github) variables.github = github;
      if (username) variables.username = username;

      try {
        const result = await this.client.query({
          query: GET_USER,
          variables,
        });
        resolve(result.data.user);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  getPublicUserById(id) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {
        id,
      };

      try {
        const result = await this.client.query({
          query: GET_USER,
          variables,
          errorPolicy: 'ignore',
        });
        resolve(result.data.user);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async getUsers(secret) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {};
      try {
        const result = await this.client.query({
          query: GET_USERS,
          variables,
          context: { headers: { authorization: secret } },
        });
        resolve(result.data.users.userConnection.nodes);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async blacklistIssue(bountyId, blacklist, secret) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: BLACKLIST_ISSUE,
          variables: { bountyId, blacklist },
          fetchPolicy: 'no-cache',
          context: { headers: { authorization: secret } },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }
  async blacklistOrganization(organizationId, blacklist, secret) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: BLACKLIST_ORGANIZATION,
          variables: { organizationId, blacklist },
          fetchPolicy: 'no-cache',
          context: { headers: { authorization: secret } },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }

  async updateRepositoryAsContest(variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPDATE_REPOSITORY_AS_CONTEST,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }

  getRepositories(variables) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_REPOSITORIES,
          variables,
        });
        resolve(result.data.repositories.nodes);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }
  getRepositoryById(id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_REPOSITORY_BY_ID,
          variables: { id },
        });
        resolve(result.data.repository);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async getContractPage(after, limit, sortOrder, orderBy, types, organizationId, category, repositoryId) {
    const variables = { after, orderBy, limit, sortOrder, organizationId, repositoryId };
    if (types) {
      variables.types = types;
    }
    if (category) {
      variables.category = category;
    }
    if (sortOrder) {
      variables.sortOrder = sortOrder;
    }
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_CONTRACT_PAGE,
          variables,
          fetchPolicy: 'no-cache',
        });
        resolve(result.data.bounties.bountyConnection);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async createProAccount(variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: CREATE_PRO_ACCOUNT,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getProAccounts() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_PRO_ACCOUNTS,
        });
        resolve(result.data.proAccounts.proAccountConnection.nodes);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getProducts() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_PRODUCTS,
        });
        resolve(result.data.products.productConnection.nodes);
      } catch (e) {
        reject(e);
      }
    });
  }
  async createProduct(secret, variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: CREATE_PRODUCT,
          variables,

          context: { headers: { authorization: secret } },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }

  updateProduct(secret, variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPDATE_PRODUCT,
          variables,
          context: { headers: { authorization: secret } },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }
  addProductToProAccount(secret, variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: ADD_PRODUCT_TO_PRO_ACCOUNT,
          variables,
          context: { headers: { authorization: secret } },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }
  getUsersPage(variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_USERS_PAGE,
          variables,
        });
        resolve(result.data.users.userConnection);
      } catch (e) {
        reject(e);
      }
    });
  }
  removeProAccountMember(variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: REMOVE_PRO_ACCOUNT_MEMBER,
          variables,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default OpenQPrismaClient;
