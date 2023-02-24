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
  SET_IS_CONTEST,
  GET_REPOSITORIES,
  GET_ALL_SUBMISSIONS,
  COMBINE_USERS,
  GET_REQUESTS,
} from './graphql/query';
import fetch from 'cross-fetch';
import { ethers } from 'ethers';

class OpenQPrismaClient {
  constructor() {}
  uri = process.env.OPENQ_API_SSR_URL ? process.env.OPENQ_API_SSR_URL : process.env.NEXT_PUBLIC_OPENQ_API_URL;
  httpLink = new HttpLink({ uri: this.uri, fetch, credentials: 'include' });

  client = new ApolloClient({
    uri: this.uri + '/graphql',
    link: this.httpLink,
    cache: new InMemoryCache(),
  });

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

  updateUser(values) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPDATE_USER,
          variables: values,
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  upsertUser(values) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPSERT_USER,
          variables: values,
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

  async getUser(idObject, types, category) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {
        types,
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
        resolve(result.data.user);
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
        });
        resolve(result.data.user);
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

  getPublicUser(github) {
    const promise = new Promise(async (resolve, reject) => {
      const variables = {
        github,
      };

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

  async setIsContest(variables) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: SET_IS_CONTEST,
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
}

export default OpenQPrismaClient;
