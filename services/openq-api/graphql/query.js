import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`
	query GetTvls($orderBy: String, $limit: Int!, $sortOrder: String, $cursor: String) {
  bountiesConnection( orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder after: String) {
    bounties {
      tvl
       address
    }
    cursor
  }
}`;

export const GET_BOUNTY_BY_HASH = gql`query bounty($contractAddress: String! ) {
  bounty(address: $contractAddress) {
    tvl
    watchingUserIds
    watchingUsers(limit: 10) {
      users {
        address
      }
    }
  }
}`;

export const GET_USER_BY_HASH = gql`query($userAddress: String!) {
  user(address: $userAddress) {
    watchedBounties(limit: 10) {
      bounties{
        address
      }
    }
  }
}`;

export const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty( $id: String!, $organizationId: String!) {
  createBounty(address: $id, organizationId: $organizationId) {
    address
  }
}`;

export const UPDATE_BOUNTY = gql`
mutation updateBounty($tvl: Float!, $id: String!, ) {
  updateBounty(tvl: $tvl, address: $id) {
        count
  }
}`;

export const WATCH_BOUNTY = gql`
mutation AddUser ($contractAddress: String, $userAddress: String ){
  watchBounty(contractAddress: $contractAddress, userAddress:$userAddress) {
    address
  }
}`;

export const UNWATCH_BOUNTY = gql`
mutation unWatchBounty ($contractAddress: String, $userAddress: String ){
  unWatchBounty(contractAddress: $contractAddress, userAddress:$userAddress) {
    address
  }
}`;

export const GET_BOUNTY_PAGE = gql`
query BountiesConnection($after: ID, $limit: Int!, $orderBy: String, $sortOrder: String, $organizationId: String) {
  bountiesConnection(after: $after, limit: $limit, orderBy: $orderBy, sortOrder: $sortOrder, organizationId: $organizationId) {
    bounties {
      tvl
			address
			organizationId
    }
		cursor
  }
}
`;