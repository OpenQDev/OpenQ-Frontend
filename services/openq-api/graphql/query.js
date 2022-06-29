import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`
	query GetTvls($orderBy: String, $limit: Int!, $sortOrder: String, $cursor: String) {
  bountiesConnection( orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder after: String) {
    bounties {
      tvl
      address
			bountyId
    }
    cursor
  }
}`;

export const GET_BOUNTY_BY_HASH = gql`query bounty($contractAddress: String! ) {
  bounty(address: $contractAddress) {
    tvl
		bountyId
    watchingUserIds
  }
}`;

export const GET_USER_BY_HASH = gql`query($userAddress: String!) {
  user(address: $userAddress) {
    watchedBountyIds
  }
}`;

export const WATCH_BOUNTY = gql`
mutation AddUser ($contractAddress: String, $userAddress: String, $signature: String  ){
  watchBounty(contractAddress: $contractAddress, userAddress:$userAddress, signature: $signature) {
    address
  }
}`;

export const UNWATCH_BOUNTY = gql`
mutation unWatchBounty ($contractAddress: String, $userAddress: String, $signature: String ){
  unWatchBounty(contractAddress: $contractAddress, userAddress:$userAddress, signature: $signature) {
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
			bountyId
    }
		cursor
  }
}
`;