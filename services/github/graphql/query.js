import { gql } from '@apollo/client';

export const GET_ISSUE = gql`
  query GetIssue($issueUrl: URI!) {
    resource(url: $issueUrl) {
        ...on Issue {
          closed
					id
					titleHTML
        	bodyHTML
          repository {
            name
            owner {
							id
              login
            }
          }
          author {
            login
          }
          createdAt
          title
          body
        }
      }
    }
`;

export const GET_ORG_BY_ID = gql`
query GetOrg($orgId: ID!) {
  node(id: $orgId) {
		__typename
    ...on Organization {
      name
      login
      id
      avatarUrl
    }
  }
}
`;

export const GET_ORGS_BY_IDS = gql`
query GetOrgs($orgIds: [ID!]!) {
  nodes(ids: $orgIds) {
		__typename
    ...on Organization {
      name
      login
      id
      avatarUrl
    }
  }
}
`;


export const GET_USER_BY_ID = gql`
query GetUser($userId: ID!) {
  node(id: $userId) {
		__typename
    ...on User {
      name
      login
      id
      avatarUrl
    }
  }
}
`;

export const GET_USERS_BY_IDS = gql`
query GetUsers($userIds: [ID!]!) {
nodes(ids: $userIds) {
  __typename
  ...on User {
    name
    login
    id
    avatarUrl
  }
}
}`;

export const GET_ORG_BY_NAME = gql`
query GetOrg($login: String!) {
  organization(login: $login) {
		__typename
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
    twitterUsername
    url
  }
}
`;

export const GET_USER_BY_NAME = gql`
query GetUser($login: String!) {
  user(login: $login) {
		__typename
		login
    id
    createdAt
    websiteUrl
    avatarUrl
    twitterUsername
    url
  }
}
`;

export const GET_ORGS_BY_ISSUES = gql`
query ($issueIds: [ID!]!) {
  nodes(ids: $issueIds) {
    ... on Issue {
      repository {
        owner {
          url
          avatarUrl
          login
        }
      }
    }
  }
}`;

export const GET_ISSUE_BY_ID = gql`
  query($issueId: ID!) {
    node(id: $issueId) {
      ... on Issue {
        closed
				title
        body
        number
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
        assignees(first: 1) {
          nodes {
            name
            url
          }
        }
        repository {
          id
          name
          owner {
            login
            avatarUrl
			... on Organization {
							twitterUsername
						}
          }
        }
      }
    }
  }
`;

export const GET_ISSUES_BY_ID = gql`
query($issueIds: [ID!]!) {
  nodes(ids: $issueIds) {
    ... on Issue {
      closed
      title
      body
      url
      id
      titleHTML
      bodyHTML				
       assignees(first: 1) {
         nodes {
           name
           url
         }
       }
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
				languages(first:10){
					edges{
						node{
							name
						}
					}
				}
        owner {
          login
          avatarUrl
        }
      }
    }
  }
}`;
