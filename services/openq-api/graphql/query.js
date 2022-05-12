import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`
	query GetTvls($orderBy: String, $limit: Int!, $sortOrder: String, $cursor: String) {
  bountiesConnection( orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder after: String) {
    bounties {
      tvl
      id
      contractAddress
    }
    cursor
  }
}`;

export const GET_BOUNTY_BY_HASH = gql`query bounty($contractAddress: String! ) {
  bounty(contractAddress: $contractAddress) {
    tvl
    id
    watchingUserIds
    watchingUsers(limit: 10) {
      users {
        userAddress
      }
    }
  }
}`;

export const GET_USER_BY_HASH = gql`query($userAddress: String!, $watchedBountiesLimit2: Int!, ) {
  user(userAddress: $userAddress){
    watchedBounties(limit: $watchedBountiesLimit2) {
      bounties{
        contractAddress
      }
    }
  }
}`;

export const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty($tvl: Float!, $id: String!) {
  createBounty(tvl: $tvl, contractAddress: $id) {
    tvl
  }
}`;

export const UPDATE_BOUNTY = gql`
mutation updateBounty($tvl: Float!, $id: String!, ) {
  updateBounty(tvl: $tvl, contractAddress: $id) {
        count
  }
}`;

export const WATCH_BOUNTY = gql`
mutation AddUser ($contractAddress: String, $userAddress: String ){
  watchBounty(contractAddress: $contractAddress, userAddress:$userAddress) {
    id
  }
}`;

export const UNWATCH_BOUNTY = gql`
mutation unWatchBounty ($contractAddress: String, $userAddress: String ){
  unWatchBounty(contractAddress: $contractAddress, userAddress:$userAddress) {
    id
  }
}`;

