import { gql } from '@apollo/client';

export const GET_ISSUE = gql`
  query GetIssue($orgName: String!, $repoName: String!, $issueId: Int!) {
    organization(login: $orgName) {
      name
      repository(name: $repoName) {
        name
        issue(number: $issueId) {
          closed
					id
          author {
            login
          }
          createdAt
          title
          body
        }
      }
    }
  }
`;
