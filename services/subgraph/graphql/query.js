import { gql } from '@apollo/client';

export const GET_ALL_BOUNTIES = gql`
query GetAllIssues {
  bounties {
    bountyAddress
    bountyId
    bountyMintTime
    bountyClosedTime
    status
    deposits {
      id
      tokenAddress
      value
      sender {
        id
      }
      receiveTime
    }
    issuer {
      id
    }
  }
}
`;

export const GET_BOUNTY = gql`
query GetBounty($id: ID!) {
  bounty(id: $id) {
    bountyAddress
    bountyId
    bountyMintTime
    bountyClosedTime
    status
    deposits {
      id
      tokenAddress
      value
      sender {
        id
      }
      receiveTime
    }
    issuer {
      id
    }
  }
}
`;

export const GET_USER = gql`
query GetUser($id: ID!) {
  user(id: $id, subgraphError: allow) {
    id
    totalFundedTokenBalance {
      id
      totalValue
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
		status
		payoutAddress {
			id
		}
		deposits {
			id
		}
		refunds {
			id
		}
		payouts {
			id
		}   
	}
}
`;

export const GET_ISSUE = gql`
  query GetIssue($orgName: String!, $repoName: String!, $issueId: Int!) {
    organization(login: $orgName) {
      name
      repository(name: $repoName) {
        name
        issue(number: $issueId) {
          closed
					id
          author {
            login
          }
          createdAt
          title
          body
        }
      }
    }
  }
`;
