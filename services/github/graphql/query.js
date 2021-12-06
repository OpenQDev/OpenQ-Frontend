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
					titleHTML
        	bodyHTML
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

export const GET_ORG_BY_NAME = gql`
query GetOrg($orgName: String!) {
  organization(login: $orgName) {
    name
		login
    id
    createdAt
    description
    email
    websiteUrl
    avatarUrl
    isVerified
		descriptionHTML
    membersWithRole(first: 10) {
      edges {
        node {
          login
        }
      }
    }
    projects(first: 10) {
      edges {
        node {
          name
        }
      }
    }
    repositories(first: 10) {
      edges {
        node {
          id
        }
      }
    }
    twitterUsername
    url
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
				titleHTML
        bodyHTML
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
