import { gql } from "@apollo/client";

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

export const GET_CURRENT_USER_AVATAR_URL = gql`
  query {
    viewer {
      avatarUrl
    }
  }
`;
