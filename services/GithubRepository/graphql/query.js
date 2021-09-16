import { gql } from '@apollo/client';

export const GET_ISSUE = gql`
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

export const GET_CURRENT_USER_AVATAR_URL = gql`
    query { 
    viewer { 
        avatarUrl
    }
    }
`;