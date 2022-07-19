import { gql } from '@apollo/client';

export const GET_STREAMS_BY_ACCOUNT = gql`query getStreams {
  account(id: "0x46e09468616365256f11f4544e65ce0c70ee624b") {
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