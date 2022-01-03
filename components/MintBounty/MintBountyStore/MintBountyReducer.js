const MintBountyReducer = (state, action) => {
	const { payload } = action;
	const { issueFound, issueClosed, isValidUrl, bountyExists, transactionPending } = payload;

	/* Enable mint button when:
	- Issue URL is valid
	- Issue is found (organization, repository, and issue number all exist)
	- Issue is not already closed on GitHub
	- A bounty has not already been minted for the provided GitHub issue
	- Transaction is not pending
	*/
	let enableMint = isValidUrl && issueFound && !issueClosed && !bountyExists && !transactionPending;

	return {
		...state,
		...payload,
		enableMint
	};
};

export default MintBountyReducer;