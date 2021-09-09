import gql from "graphql-tag";

const GET_ISSUE = gql`
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
`;

export default GET_ISSUE;
