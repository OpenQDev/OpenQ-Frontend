import { gql } from '@apollo/client';

// ISSUES

export const GET_ISSUE = gql`
  query GetIssue($issueUrl: URI!) {
    resource(url: $issueUrl) {
      ... on Issue {
        closed
        id
        titleHTML
        bodyHTML
        url
        repository {
          id
          name
          owner {
            id
            login
            avatarUrl
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

export const GET_LEAN_ISSUES_BY_ID = gql`
  query ($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Issue {
        title
        url
        closed
        id
      }
    }
  }
`;

export const GET_ISSUE_BY_ID = gql`
  query ($id: ID!) {
    node(id: $id) {
      ... on Issue {
        closed
        closedAt
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
            login
            url
            avatarUrl
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
        timelineItems(first: 100, itemTypes: [CROSS_REFERENCED_EVENT, CLOSED_EVENT]) {
          nodes {
            ... on CrossReferencedEvent {
              id
              referencedAt

              source {
                ... on PullRequest {
                  createdAt
                  mergedAt
                  url
                  id
                  merged
                  bodyText
                  body
                  bodyHTML
                  title
                  author {
                    ... on Bot {
                      id
                    }
                    ... on EnterpriseUserAccount {
                      id
                      name
                    }
                    ... on User {
                      id
                      email
                    }
                    ... on Organization {
                      id
                      email
                    }
                    ... on Mannequin {
                      id
                      email
                    }
                    login
                    avatarUrl
                    url
                  }
                  mergeCommit {
                    author {
                      avatarUrl
                      name
                      user {
                        login
                        url
                      }
                    }
                  }
                }
              }
            }
            ... on ClosedEvent {
              id
              actor {
                avatarUrl
                login
                url
                ... on Organization {
                  name
                }
                ... on EnterpriseUserAccount {
                  name
                }
                ... on User {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ORGS_BY_ISSUES = gql`
  query ($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Issue {
        repository {
          owner {
            url
            avatarUrl
            login
            descriptionHTML
            description
          }
        }
      }
    }
  }
`;

// PULL REQUESTS

export const GET_PRS = gql`
  query getPrs(
    $owner: String!
    $name: String!
    $first: Int!
    $cursor: String
    $field: IssueOrderField!
    $direction: OrderDirection!
  ) {
    repository(owner: $owner, name: $name) {
      name
      pullRequests(first: $first, orderBy: { field: $field, direction: $direction }, after: $cursor) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
          }
          cursor
        }
        nodes {
          id
          bodyText
          body
          title
          url
          author {
            url
            login
            avatarUrl
          }
          repository {
            owner {
              avatarUrl
            }
          }
          createdAt
        }
      }
    }
  }
`;

export const GET_PRS_BY_ISSUES = gql`
  query getPrs($ids: [ID!]!) {
    nodes(ids: $ids) {
      id
      ... on Issue {
        id
        timelineItems(first: 100) {
          edges {
            node {
              ... on CrossReferencedEvent {
                id
                source {
                  ... on PullRequest {
                    id
                    bodyText
                    title
                    url
                    createdAt
                    repository {
                      owner {
                        avatarUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PR_BY_ID = gql`
  query getPr($id: ID!) {
    node(id: $id) {
      ... on PullRequest {
        id
        bodyHTML
        url
        title
        createdAt
        author {
          login
          avatarUrl
          url
          ... on User {
            id
            twitterUsername
            bio
          }
        }
      }
    }
  }
`;

// ORGANIZATION

export const GET_ORG_BY_ID = gql`
  query GetOrg($id: ID!) {
    node(id: $id) {
      __typename
      ... on Organization {
        name
        login
        id
        avatarUrl
      }
    }
  }
`;

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
      location
      twitterUsername
      url
      membersWithRole(first: 100) {
        nodes {
          avatarUrl
          name
          login
          url
        }
      }
    }
  }
`;

export const GET_ORGS_OR_USERS_BY_IDS = gql`
  query GetOrgs($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      ... on Organization {
        name
        login
        id
        url
        description
        descriptionHTML
      }
      ... on User {
        name
        login
        bio
        id
        url
      }
    }
  }
`;

export const GET_ORGS_BY_IDS = gql`
  query GetOrgs($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      ... on Organization {
        name
        login
        description
        id
        avatarUrl
        url
      }
      ... on User {
        name
        login
        bio
        id
        avatarUrl
        url
      }
    }
  }
`;

// USER

export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    node(id: $id) {
      __typename
      ... on User {
        repositories(last: 100) {
          nodes {
            languages(first: 10) {
              nodes {
                name
              }
            }
          }
        }
        name
        login
        bio
        email
        id
        websiteUrl
        url
        avatarUrl
        twitterUsername
      }
    }
  }
`;

export const GET_USERS_BY_IDS = gql`
  query GetUsers($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      ... on User {
        name
        login
        bio
        id
        url
        avatarUrl
      }
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
      bio
      avatarUrl
      twitterUsername
      url
    }
  }
`;

// REPOSITORY

export const GET_REPO_BY_NAME = gql`
  query GetRepo($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      __typename
      name
      nameWithOwner
      id
      description
      homepageUrl
      url
      languages(first: 10) {
        edges {
          node {
            name
            color
          }
        }
      }
    }
  }
`;

export const GET_REPO_NAMES_BY_ORG_NAME = gql`
  query GetRepoNamesByOrgName($orgName: String!) {
    organization(login: $orgName) {
      repositories(last: 100) {
        nodes {
          __typename
          name
          nameWithOwner
          id
          description
          homepageUrl
          url
          languages(first: 1) {
            nodes {
              id
              name
              color
            }
          }
        }
      }
    }
  }
`;

export const GET_REPO_NAMES_BY_USER_NAME = gql`
  query GetRepoNamesByUserName($userName: String!) {
    user(login: $userName) {
      repositories(last: 100) {
        nodes {
          __typename
          name
          nameWithOwner
          id
          description
          homepageUrl
          url
          languages(first: 1) {
            nodes {
              id
              name
              color
            }
          }
        }
      }
    }
  }
`;

export const GET_REPOS_BY_IDS = gql`
  query GetRepos($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Repository {
        id
        descriptionHTML
        description
        owner {
          avatarUrl
          login
        }
        stargazerCount
        languages(first: 10) {
          nodes {
            name
            color
          }
        }
        name
      }
    }
  }
`;

export const GET_USER_BY_URL = gql`
  query ($url: URI!) {
    resource(url: $url) {
      ... on User {
        id
        email
        twitterUsername
        bio
        avatarUrl
        login
      }
    }
  }
`;

export const GET_ISSUES_BY_ID = gql`
  query ($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Issue {
        closed
        title
        body
        url
        id
        number
        titleHTML
        bodyHTML
        timelineItems(first: 100, itemTypes: CROSS_REFERENCED_EVENT) {
          edges {
            node {
              ... on CrossReferencedEvent {
                source {
                  ... on PullRequest {
                    url
                    createdAt
                    merged
                    title
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
        assignees(first: 1) {
          nodes {
            name
            login
            url
            avatarUrl
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
          url
          description
          name
          languages(first: 10) {
            edges {
              node {
                name
                color
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
  }
`;

export const GET_IS_ADMIN = gql`
  query ($login: String!, $team: String!) {
    organization(login: $login) {
      team(slug: $team) {
        members(first: 10) {
          nodes {
            id
            login
          }
        }
      }
    }
  }
`;

export const GET_ORG_BY_URL = gql`
  query ($url: URI!) {
    resource(url: $url) {
      ... on Organization {
        id
        login
        name
        avatarUrl
        url
      }

      ... on User {
        id
        login
        name
        avatarUrl
        url
      }
    }
  }
`;
