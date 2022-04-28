import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`
	query GetTvls($orderBy: String, $limit: Int!, $sortOrder: String, $cursor: String) {
  bountiesConnection( orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder after: String) {
    bounties {
      tvl
      id
      contractId
    }
    cursor
  }
}`;

export const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty($tvl: Float!, $id: String!) {
  createBounty(tvl: $tvl, contractId: $id) {
    contractId
  }
}`;

export const UPDATE_BOUNTY = gql`
mutation updateBounty($tvl: Float!, $id: String!, ) {
  updateBounty(tvl: $tvl, contractId: $id) {
        count
  }
}`;