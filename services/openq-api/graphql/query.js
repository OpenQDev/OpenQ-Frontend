import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`
  query GetTvls($orderBy: String, $limit: Int!, $sortOrder: String, $cursor: String) {
    bountiesConnection(orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder, after: String) {
      bounties {
        tvl
        address
        bountyId
      }
      cursor
    }
  }
`;

export const GET_BOUNTY_BY_HASH = gql`
  query bounty($contractAddress: String!) {
    bounty(address: $contractAddress) {
      tvl
      bountyId
    }
  }
`;

export const GET_PR_BY_ID = gql`
  query pr($prId: String!) {
    pr(prId: $prId) {
      prId
      bountyAddress
      contributorIds
      contributors {
        userId
        address
      }
    }
  }
`;

export const GET_ALL_CONTRACTS = gql`
  query getAllContracts {
    bounties(limit: 200) {
      nodes {
        address
        bountyId
        blacklisted
        organization {
          blacklisted
        }
      }
    }
  }
`;

export const CREATE_PR = gql`
  mutation createPr($prId: String!, $bountyAddress: String!, $thumbnail: String) {
    createPr(prId: $prId, bountyAddress: $bountyAddress, thumbnail: $thumbnail) {
      prId
    }
  }
`;

export const ADD_CONTRIBUTOR = gql`
  mutation addContributor($prId: String, $userId: String, $address: String) {
    addContributor(prId: $prId, userId: $userId, address: $address) {
      thumbnail
    }
  }
`;

export const REMOVE_CONTRIBUTOR = gql`
  mutation remove($prId: String, $userId: String) {
    removeContributor(prId: $prId, userId: $userId) {
      thumbnail
    }
  }
`;
// good to go
export const GET_USER_BY_HASH = gql`
  query ($userAddress: String!, $types: [String], $category: String) {
    user(address: $userAddress) {
      watchedBountyIds
      watchedBounties(limit: 100, types: $types, category: $category) {
        nodes {
          tvl
          address
          bountyId
          watchingCount
        }
      }
      starredOrganizationIds
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query getOrganization($organizationId: String!) {
    organization(organizationId: $organizationId) {
      blacklisted
      bounties(limit: 10) {
        bountyConnection {
          nodes {
            tvl
            bountyId
            address
            blacklisted
            category
          }
          cursor
        }
      }
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query getOrganizations($types: [String], $batch: Int!, $category: String) {
    organizations(types: $types, category: $category) {
      blacklisted
      id
      starringUserIds
      bounties(limit: $batch, types: $types, category: $category) {
        nodes {
          tvl
          bountyId
          address
          blacklisted
          category
        }
      }
    }
  }
`;

export const GET_LEAN_ORGANIZATIONS = gql`
  query getLeanOrganizations {
    organizations {
      id
      blacklisted
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $address: String!
    $company: String
    $email: String
    $city: String
    $streetAddress: String
    $country: String
    $province: String
  ) {
    updateUser(
      address: $address
      company: $company
      email: $email
      city: $city
      streetAddress: $streetAddress
      country: $country
      province: $province
    ) {
      address
    }
  }
`;

export const WATCH_BOUNTY = gql`
  mutation AddUser($contractAddress: String, $userAddress: String) {
    watchBounty(contractAddress: $contractAddress, userAddress: $userAddress) {
      address
    }
  }
`;

export const UNWATCH_BOUNTY = gql`
  mutation unWatchBounty($contractAddress: String, $userAddress: String) {
    unWatchBounty(contractAddress: $contractAddress, userAddress: $userAddress) {
      address
    }
  }
`;

export const STAR_ORG = gql`
  mutation starOrg($id: String!, $address: String!) {
    starOrg(id: $id, address: $address) {
      id
      starringUserIds
    }
  }
`;

export const UN_STAR_ORG = gql`
  mutation unStarOrg($id: String!, $address: String!) {
    unStarOrg(id: $id, address: $address) {
      id
      starringUserIds
    }
  }
`;

// good to go
export const GET_CONTRACT_PAGE = gql`
  query BountiesConnection(
    $after: ID
    $orderBy: String
    $sortOrder: String
    $organizationId: String
    $types: [String]
    $limit: Int!
    $category: String
  ) {
    bounties(
      after: $after
      limit: $limit
      orderBy: $orderBy
      sortOrder: $sortOrder
      organizationId: $organizationId
      types: $types
      category: $category
    ) {
      bountyConnection {
        nodes {
          tvl
          address
          organizationId
          bountyId
          type
          category
          watchingCount
          createdAt
          blacklisted
          organization {
            blacklisted
          }
        }
        cursor
      }
    }
  }
`;

export const BLACKLIST_ISSUE = gql`
  mutation blacklist($bountyId: String, $blacklist: Boolean) {
    blackList(bountyId: $bountyId, blackList: $blacklist) {
      blacklisted
    }
  }
`;
export const BLACKLIST_ORG = gql`
  mutation blacklistOrg($organizationId: String, $blacklist: Boolean) {
    blackListOrg(organizationId: $organizationId, blackList: $blacklist) {
      blacklisted
    }
  }
`;
