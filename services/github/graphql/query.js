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
    ...on Organization {
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
}`;

export const GET_ISSUE_CLOSER = gql`query($issueId:ID!) {
  node(id: $issueId) {
    ... on Issue {
      timelineItems(itemTypes: [CLOSED_EVENT], first: 10) {
        nodes {
          ... on ClosedEvent {
            closer {
              ... on PullRequest {
                title
                url
                author {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
}`;
