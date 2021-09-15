import gql from "graphql-tag";

const GET_ISSUE = gql`
  query GetIssue($orgName: String!, $repoName: String!, $issueId: Int!) {
    organization(login: $orgName) {
      repository(name: $repoName) {
        issue(number: $issueId) {
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
