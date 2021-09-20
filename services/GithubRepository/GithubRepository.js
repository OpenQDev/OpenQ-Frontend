import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { GET_ISSUE, GET_CURRENT_USER_AVATAR_URL } from "./graphql/query";
import fetch from "cross-fetch";
import { setContext } from "@apollo/client/link/context";

class GithubRepository {
  constructor() { }

  httpLink = new HttpLink({ uri: "https://api.github.com/graphql", fetch });

  authLink = setContext((_, { headers }) => {
    const token = "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";
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

  async fetchIssue(id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_ISSUE,
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
}

export default GithubRepository;
