import { gql } from '@apollo/client';

export const GET_ALL_BOUNTIES = gql`
query GetAllIssues($skip: Int! $sortOrder: String!, $quantity: Int!) {
  bounties(orderBy: bountyMintTime, orderDirection: $sortOrder, first: $quantity, skip: $skip) {
    bountyAddress
    bountyId
    bountyMintTime
    bountyClosedTime
    status
		closerData
		claimedTransactionHash
		deposits {
    		id
			refunded
			refundTime
			expiration
      tokenAddress
      volume
      sender {
        id
      }
      receiveTime
    }
    issuer {
      id
    }
    bountyTokenBalances {
      volume
      tokenAddress
    }
  }
}
`;

export const GET_PAYOUT_TRANSACTION_HASH = gql`
query GetPayoutTransactionHash($bountyAddress: ID!) {
  payouts(where: {bounty: $bountyAddress}) {
    transactionHash
  }
}
`;
export const GET_LEAN_ORGANIZATIONS = gql`query GetOrganization {
organizations  {id}
}`;

export const GET_LEAN_BOUNTIES = gql`
query getBounty {  
  bounties{bountyAddress, bountyId}
}`;
export const GET_BOUNTY = gql`
query GetBounty($id: ID!) {
  bounty(id: $id) {
    bountyAddress
    bountyId
		closerData
    bountyMintTime
    bountyClosedTime
		claimedTransactionHash
    payoutAddress
    status
		closer{
		id
		}
		deposits {
      id
			refunded
			refundTime
      tokenAddress
			expiration
      volume
      sender {
        id
      }
      receiveTime
    }
		bountyTokenBalances {
		  tokenAddress
      volume
		}
    issuer {
      id
    }
  }
}
`;


export const GET_BOUNTY_BY_ID = gql`
query GetBountyById($id: ID!) {
  bounties(where: { bountyId: $id }) {
    bountyAddress
    bountyId
		closerData
    bountyMintTime
    bountyClosedTime
		claimedTransactionHash
    status
		deposits {
      id
			refunded
			refundTime
      tokenAddress
			expiration
      volume
      sender {
        id
      }
      receiveTime
    }
		bountyTokenBalances {
		  tokenAddress
      volume
		}
    issuer {
      id
    }
  }
}
`;

export const GET_BOUNTIES_BY_CONTRACT_ADDRESSES = gql`
query GetBountiesByContractAddresses($contractAddresses: [ID]!) {
  bounties(where: {bountyAddress_in: $contractAddresses}) {
       bountyAddress
    bountyId
    bountyMintTime
    bountyClosedTime
    status
		closerData
		claimedTransactionHash
		deposits {
    		id
			refunded
			refundTime
			expiration
      tokenAddress
      volume
      sender {
        id
      }
      receiveTime
    }
    issuer {
      id
    }
    bountyTokenBalances {
      volume
      tokenAddress
    }
  }
}`;


export const GET_USER = gql`
query GetUser($id: ID!) {
  user(id: $id, subgraphError: allow) {
    id
    bountiesCreated {
			bountyAddress
			bountyId
			bountyMintTime
			bountyClosedTime
			id
			claimedTransactionHash
			status
			deposits {
				id
				refunded
				refundTime
				tokenAddress
				volume
				expiration
				sender {
					id
				}
				receiveTime
			}
			issuer {
				id
			}
			bountyTokenBalances {
				volume
				tokenAddress
			}
    }
    bountiesClosed {
      bountyId
      bountyTokenBalances{
        volume
        tokenAddress
      }
      id
    }
    deposits {
      id
			refunded
			refundTime
      tokenAddress
      volume
			expiration
			receiveTime
      bounty {
        id
				bountyId
				status
      }
    }
    fundedTokenBalances {
      id
      volume
      tokenAddress
    }    
    payoutTokenBalances {
      volume
      tokenAddress
    }
    payouts {
      id
      tokenAddress
      volume
      payoutTime
      organization {
        id
      }
    }
  }
}
`;


export const GET_PAGINATED_ORGANIZATION_DATA = gql`
query GetOrganization($id: ID!, $skip: Int, $order: String, $first: Int, ) {
  organization(id: $id, subgraphError: allow) {
	id
    bountiesCreated( orderBy: bountyMintTime, orderDirection: $order, skip: $skip, first: $first) {
		bountyAddress
		bountyId
		bountyMintTime
		bountyClosedTime
		claimedTransactionHash
		status
		deposits {
			id
			refunded
			refundTime
			tokenAddress
			volume
			expiration
			receiveTime
			sender {
				id
			}
			receiveTime
		}
		issuer {
			id
		}
		bountyTokenBalances {
			volume
			tokenAddress
		}
	}}
}`;

export const GET_ORGANIZATION_BOUNTIES_BY_ADDRESS = gql`
query GetOrganization($id: ID!, $skip: Int, $order: String, $first: Int, $contractAddresses: [ID]!) {
  organization(id: $id, subgraphError: allow) {
	id
    bountiesCreated(where: {bountyAddress_in: $contractAddresses}, orderBy: bountyMintTime, orderDirection: $order, skip: $skip, first: $first) {
		bountyAddress
		bountyId
		bountyMintTime
		bountyClosedTime
		claimedTransactionHash
		status
		deposits {
			id
			refunded
			refundTime
			tokenAddress
			volume
			expiration
			receiveTime
			sender {
				id
			}
			receiveTime
		}
		issuer {
			id
		}
		bountyTokenBalances {
			volume
			tokenAddress
		}
	}}
}`;



export const GET_ORGANIZATION = gql`
query GetOrganization($id: ID!, $quantity: Int!) {
  organization(id: $id, subgraphError: allow) {
		id
    bountiesCreated(orderBy: bountyMintTime, orderDirection: desc, first: $quantity) {
			bountyAddress
			bountyId
			bountyMintTime
			bountyClosedTime
			claimedTransactionHash
			status
			deposits {
				id
				refunded
				refundTime
				tokenAddress
				volume
				expiration
				receiveTime
				sender {
					id
				}
				receiveTime
			}
			issuer {
				id
			}
			bountyTokenBalances {
				volume
				tokenAddress
			}
    }
    fundedTokenBalances(orderBy: volume, orderDirection: desc) {
      id
      tokenAddress
      volume
    }
    deposits {
      id
			refunded
			refundTime
      tokenAddress
      volume
			expiration
			receiveTime
      bounty {
        id
        bountyId
      }
      sender {
        id
      }
    }
    payouts {
      id
      tokenAddress
      payoutTime
      volume
    }
		payoutTokenBalances {
		  id
      volume
      tokenAddress
		}
  }
}
`;

export const GET_ORGANIZATIONS_BY_IDS = gql`
query getOrgs($organizationIds: [ID!]!) {
  organizations(where: {id_in: $organizationIds}) {
    id
    bountiesCreated {
      bountyAddress
      bountyId
      bountyTokenBalances {
        id
      }
      status
    }
  }
}`;

export const GET_ORGANIZATIONS = gql`
query GetOrganizations {
  organizations {
    id
    bountiesCreated {
			bountyAddress
			bountyId
			bountyTokenBalances{
			id
			}
			status
    }
  }
}
`;

export const SUBSCRIBE_TO_BOUNTY = gql`
subscription SubscribeToBounty($bountyId: String!) {
	bounties(where: {bountyId: $bountyId}) {
		id
		bountyId
		bountyMintTime
		bountyClosedTime
		claimedTransactionHash
		status
		deposits {
			id
			refunded
			refundTime
			expiration
		}
		refunds {
			id
			refundTime
		}
		payouts {
			id
		}   
	}
}
`;
