const MintBountyReducer = (state, action) => {
	const { issueFound, issueClosed, isValidUrl, bountyExists, transactionPending } = action;

	/* Enable mint button when:
	- Issue URL is valid
	- Issue is found (organization, repository, and issue number all exist)
	- Issue is not already closed on GitHub
	- A bounty has not already been minted for the provided GitHub issue
	- Transaction is not pending
	*/

	const reducedState = {
		...state,
		...action
	};

	return reducedState;
};

export default MintBountyReducer;