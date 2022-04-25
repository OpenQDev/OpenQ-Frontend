import Utils from '../utils/Utils';

/**
	 * Each method contains a tuple of { CONTRACT_THROWN_REVERT_STRING : USER_FRIENDLY ERROR MESSAGE }
	 */
const jsonRpcErrors =
	[
		// MINT
		{
			'ERC1167: create2 failed': {
				title: 'Bounty already exists',
				message: () => {
					return 'A bounty for that issue already exists';
				}
			}
		},
		// FUND
		{
			'FUNDING_CLOSED_BOUNTY': {
				title: 'Cannot fund a closed bounty',
				message: ({ bounty }) => {
					return `Bounty was closed on ${bounty.bountyClosedTime}`;
				}
			}
		},
		{
			'ZERO_VOLUME_SENT': {
				title: 'Zero Volume Sent',
				message: () => {
					return 'Must send a greater than 0 volume of tokens.';
				}
			}
		},
		{
			'ERC20: transfer amount exceeds balance': {
				title: 'Transfer amount exceeds balance',
				message: () => {
					return 'Transfer amount exceeds balance';
				}
			}
		},
		{
			'NONCE_TO_HIGH': {
				title: 'Nonce Too High',
				message: () => {
					return 'Nonce too high. If developing locally, Go to MetaMask -> Accounts -> Settings -> Advanced -> Reset Account';
				}
			}
		},
		// REFUND
		{
			'BOUNTY_ALREADY_REFUNDED': {
				title: 'Bounty Already Refunded',
				message: () => {
					return 'Bounty was already refunded';
				}
			}
		},
		{
			'PREMATURE_REFUND_REQUEST': {
				title: 'Too early to withdraw funds',
				message: ({ bounty }) => {
					const utils = new Utils();
					return `Bounty was minted on ${utils.formatUnixDate(bounty.bountyMintTime)}`;
				}
			}
		},
		{
			'ONLY_FUNDERS_CAN_REQUEST_REFUND': {
				title: 'Not a Funder',
				message: ({ account }) => `Only funders can request refunds on this issue. Your address ${account} has not funded this issue.`
			}
		},
		{
			'REFUNDING_CLOSED_BOUNTY': {
				title: 'Cannot request refund on a closed bounty',
				message: () => 'You are requesting on a closed bounty'
			}
		},
		// CLAIM
		{
			'CLAIMING_CLOSED_BOUNTY': {
				title: 'Cannot claim a closed bounty',
				message: () => 'You are attempting to claim a closed bounty'
			}
		},
		// CONNECTION
		{
			'METAMASK_HAVING_TROUBLE': {
				title: 'Cannot Connect to network.',				
				message: () => {
					return 'Please check your wallet settings.';
				}
			}
		},
		// MISCELLANEOUS
		{
			'USER_DENIED_TRANSACTION': {
				title: 'User Denied Transaction',
				message: () => {
					return 'Thank You! Come Again!';
				}
			}
		},

		{
			'INTERNAL_ERROR': {
				title: 'Something Went Wrong',
				message: ()=>{
					'Something went awry and the transaction failed! Please reload and attempt to fund again.';
				} 
			}
		}
	];


export default jsonRpcErrors;