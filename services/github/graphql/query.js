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

export const GET_ISSUE_BY_ID = gql`
  query($issueId: ID!) {
    node(id: $issueId) {
      ... on Issue {
        closed
				title
        body
        url
				id
        labels(first: 10) {
          edges {
            node {
              name
              color
            }
          }
        }
				createdAt
        repository {
          id
          name
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

export const GET_CURRENT_USER_AVATAR_URL = gql`
  query {
    viewer {
      avatarUrl
      login
    }
  }
`;
