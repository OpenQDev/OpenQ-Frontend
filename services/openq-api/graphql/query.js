import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`
	query GetTvls($orderBy: String, $limit: Int!, $sortOrder: String, $cursor: String) {
  bountiesConnection( orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder after: String) {
    bounties {
      tvl
      bountyId
      id
    }
    cursor
  }
}`;

export const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty($tvl: Float!, $bountyId: String!) {
  createBounty(tvl: $tvl, bountyId: $bountyId) {
    bountyId
  }
}`;

export const UPDATE_BOUNTY = gql`
mutation updateBounty($tvl: Float!, $bountyId: String!, ) {
  updateBounty(tvl: $tvl, bountyId: $bountyId) {
        count
  }
}`;