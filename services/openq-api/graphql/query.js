import { gql } from '@apollo/client';

export const GET_PAGINATED_TVLS = gql`{
	query Query( $orderBy: String, $limit: Int!, $sortOrder: String) {
  bountiesConnection( orderBy: $orderBy, limit: $limit, sortOrder: $sortOrder) {
    bounties {
      tvl
      bountyId
      id
    }
    cursor
  }
}
}`;