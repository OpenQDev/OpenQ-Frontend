import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

function createApolloClient() {
  const token = process.env.PAT;

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }),
    cache: new InMemoryCache(),
  });
}

export default createApolloClient;
