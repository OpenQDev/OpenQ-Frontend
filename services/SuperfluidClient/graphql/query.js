import { gql } from '@apollo/client';

export const GET_STREAMS_BY_ACCOUNT = gql`
  query getStreams($account: String!) {
    account(id: $account) {
      outflows {
        currentFlowRate
        createdAtTimestamp
        deposit
        receiver {
          id
        }
        token {
          decimals
          isListed
          id
          name
          symbol
        }
      }
      inflows {
        currentFlowRate
        createdAtTimestamp
        token {
          decimals
          isListed
          id
          name
          symbol
        }
        deposit
        sender {
          id
        }
      }
    }
  }
`;
