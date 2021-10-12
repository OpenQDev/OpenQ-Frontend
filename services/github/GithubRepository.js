import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { GET_ISSUE, GET_CURRENT_USER_AVATAR_URL, GET_ISSUE_BY_ID } from "./graphql/query";
import fetch from "cross-fetch";
import { setContext } from "@apollo/client/link/context";

class GithubRepository {
  constructor() { }

  httpLink = new HttpLink({ uri: "https://api.github.com/graphql", fetch });

  authLink = setContext((_, { headers }) => {
    const token = process.env.PAT;
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
  });

  client = new ApolloClient({
    uri: "https://api.github.com/graphql",
    link: this.authLink.concat(this.httpLink),
    cache: new InMemoryCache(),
  });

  async fetchIssue(orgName, repoName, issueId) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_ISSUE, variables: { orgName, repoName, issueId },
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });

    return promise;
  }

  async fetchIssueById(issueId) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_ISSUE_BY_ID, variables: { issueId },
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });

    return promise;
  }

  async fetchAvatarUrl() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_CURRENT_USER_AVATAR_URL,
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });

    return promise;
  }

  async getIssueData(issues) {
    const issueDataObjects = [];
    for (let issueId of issues) {
      const response = await this.fetchIssueById(issueId);
      const responseData = response.data.node;
      const { title, body, url } = responseData;
      const repoName = responseData.repository.name;
      const avatarUrl = responseData.repository.owner.avatarUrl;
      const owner = responseData.repository.owner.login;
      const labels = responseData.labels.edges.map(edge => edge.node);

      const issueData = { issueId, title, body, url, repoName, owner, avatarUrl, labels };

      issueDataObjects.push(issueData);
    }
    return issueDataObjects;
  }
}

export default GithubRepository;
