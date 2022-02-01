/**
	 * 
	 * Each method contains a tuple of { CONTRACT_THROWN_REVERT_STRING : USER_FRIENDLY ERROR MESSAGE }
	 * 
	 */
const jsonRpcErrors =
	[
		{ 'Only funders of this bounty can reclaim funds after 30 days': 'Only funders of this bounty can reclaim funds after 30 days' },
		{ 'Too early to withdraw funds': 'Too early to withdraw funds' },
		{ 'Cannot request refund on a closed bounty': 'Cannot request refund on a closed bounty' },
		{ 'Cannot fund a closed bounty': 'Cannot fund a closed bounty' }
	];


export default jsonRpcErrors;