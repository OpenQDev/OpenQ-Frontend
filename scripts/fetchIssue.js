/* Get GitHub Issue URL Information for CreateBountyModal Component */

export async function getStaticProps() {
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
  const { data } = await client.query({
    query: gql`
      query {
        organization(login: "OpenQDev") {
          repository(name: "app") {
            issue(number: 86) {
              id
              author {
                login
              }
              createdAt
              comments {
                totalCount
              }
              title
            }
          }
        }
      }
    `,
  });
  return {
    props: { data },
  };
}
