import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import GET_ISSUE from "../lib/queries/getIssue";
/* Get GitHub Issue URL Information for CreateBountyModal Component */

export async function fetchIssue() {
  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token via GitHub PAT
    const token = process.env.PAT;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const promise = new Promise(async (resolve, reject) => {
    try {
      const result = await client.query({
        query: GET_ISSUE,
      });
      console.log("resolved data: ", result);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });

  return {
    props: { result },
  };
}
