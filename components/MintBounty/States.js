export const RESTING_STATE = () => {
	return {
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
		error: false,
		isLoading: false,
		isValidUrl: false,
		issueClosed: false,
		transactionPending: false,
	};
};

export const BOUNTY_DOES_NOT_EXIST = () => {
	return {
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
	};
};

export const WALLET_CONNECTED = () => {
	return {
		walletConnected: true
	};
};

export const WALLET_DISCONNECTED = () => {
	return {
		walletConnected: false
	};
};

export const ISSUE_FOUND = (issue) => {
	return {
		error: false,
		isValidUrl: true,
		issueClosed: issue.closed,
		issueData: issue,
		issueId: issue.id,
		issueFound: true,
	};
};

export const ISSUE_NOT_FOUND = () => {
	return {
		issueFound: false,
		issueData: null,
	};
};

export const VALID_URL = (orgName, repoName, issueNumber) => {
	return {
		isValidUrl: true,
		orgName,
		repoName,
		issueNumber,
	};
};

export const INVALID_URL = () => {
	return {
		isValidUrl: false,
	};
};

export const BOUNTY_EXISTS = (bounty) => {
	return {
		bounty: bounty,
		bountyAddress: bounty.bountyAddress,
		bountyExists: true,
		claimed: bounty.status === 'CLOSED'
	};
};

export const ERROR = (error) => {
	return {
		error,
	};
};

export const TRANSACTION_PENDING = () => {
	return {
		isBountyMinted: false,
		isLoading: true,
		transactionPending: true,
	};
};

export const TRANSACTION_SUCCESS = (bountyAddress) => {
	return {
		bountyAddress,
		isBountyMinted: true,
		isLoading: false,
		transactionPending: false,
	};
};

export const TRANSACTION_FAILURE = (error) => {
	return {
		error: error,
		isBountyMinted: false,
		isLoading: false,
		transactionPending: false,
	};
};

export const NOTIFICATIONS_CLOSED = () => {
	return {
		isBountyMinted: false,
	};
};
