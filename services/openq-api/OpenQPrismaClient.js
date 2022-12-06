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
  GET_PR_BY_ID,
  CREATE_PR,
  ADD_CONTRIBUTOR,
  REMOVE_CONTRIBUTOR,
  GET_ORGANIZATIONS,
  STAR_ORG,
  UN_STAR_ORG,
  GET_ORGANIZATION,
  BLACKLIST_ISSUE,
  BLACKLIST_ORG,
  UPDATE_USER_SIMPLE,
  GET_USERS,
  SET_IS_CONTEST,
  GET_REPOSITORIES,
  GET_ALL_PRS,
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

  async watchBounty(contractAddress, userAddress) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: WATCH_BOUNTY,
          variables: { contractAddress, userAddress },
          fetchPolicy: 'no-cache',
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async unWatchBounty(contractAddress, userAddress) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UNWATCH_BOUNTY,
          variables: { contractAddress, userAddress },
          fetchPolicy: 'no-cache',
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async unStarOrg(id, address) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UN_STAR_ORG,
          variables: { id, address },
        });
        resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async starOrg(id, address) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: STAR_ORG,
          variables: { id, address },
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
        resolve(result.data.bounty);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async getPr(prId) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_PR_BY_ID,
          variables: { prId },
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

  getPullRequests() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_ALL_PRS,
        });
        console.log(result.data);
        resolve(result.data.prs);
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
        resolve(result.data.organizations);
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
        resolve(result.data);
      } catch (e) {
        console.log(e);
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

  // only updates github and address, no auth
  updateUserSimple(values) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.mutate({
          mutation: UPDATE_USER_SIMPLE,
          variables: values,
        });
        resolve(result.data);
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
        ...idObject,
        types,
      };
      if (category) {
        variables.category = category;
      }
      try {
        const result = await this.client.query({
          query: GET_PRIVATE_USER,
          variables,
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
        resolve(result.data.usersConnection.users);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }

  async blacklistOrg(organizationId, blacklist, secret) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: BLACKLIST_ORG,
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

  async blacklistIssue(bountyId, blacklist, secret) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: BLACKLIST_ISSUE,
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
        resolve(result.data.organization.repositories.nodes);
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
