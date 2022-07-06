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

export const GET_PR_BY_ID = gql`query pr($prId: String!){
  pr(prId:$prId){
    prId
    bountyAddress
    contributorIds
		contributors{
      userId
			address
    }
  }
}


`;

export const CREATE_PR = gql`mutation createPr($prId: String! $bountyAddress: String!, $thumbnail: String){
createPr(prId: $prId, bountyAddress: $bountyAddress, thumbnail: $thumbnail){
	prId
}

}`;

export const ADD_CONTRIBUTOR=gql`mutation addContributor($prId: String, $userId: String, $address: String){
  addContributor(prId:$prId, userId: $userId, address: $address){
    thumbnail
  }
}`;

export const REMOVE_CONTRIBUTOR=gql`mutation remove($prId: String, $userId: String){
  removeContributor(prId:$prId, userId: $userId){
    thumbnail
  }
}`;

export const GET_USER_BY_HASH = gql`query($userAddress: String!) {
  user(address: $userAddress) {
    watchedBountyIds
  }
}`;

export const WATCH_BOUNTY = gql`
mutation AddUser ($contractAddress: String, $userAddress: String){
  watchBounty(contractAddress: $contractAddress, userAddress:$userAddress) {
    address
  }
}`;

export const UNWATCH_BOUNTY = gql`
mutation unWatchBounty ($contractAddress: String, $userAddress: String){
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
			bountyId
    }
		cursor
  }
}
`;