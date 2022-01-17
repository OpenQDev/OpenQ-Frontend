export const RESTING_STATE = () => {
	return {
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
		error: false,
		errorMessage: '',
		isLoading: false,
		isValidUrl: false,
		issueClosed: false,
		transactionPending: false
	};
};

export const BOUNTY_DOES_NOT_EXIST = () => {
	return {
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
	};
};

export const ISSUE_FOUND = (issue) => {
	return {
		error: false,
		errorMessage: '',
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
		issueData: null
	};
};

export const VALID_URL = (orgName, repoName, issueNumber) => {
	return {
		isValidUrl: true,
		orgName,
		repoName,
		issueNumber
	};
};

export const INVALID_URL = () => {
	return {
		isValidUrl: false
	};
};

export const BOUNTY_EXISTS = (bounty) => {
	return {
		bounty: bounty,
		bountyAddress: bounty.bountyAddress,
		bountyExists: true,
	};
};

export const ERROR = (error) => {
	return {
		error: true,
		errorMessage: error.message,
	};
};

export const TRANSACTION_PENDING = () => {
	return {
		error: false,
		errorMessage: '',
		isBountyMinted: false,
		isLoading: true,
		transactionPending: true
	};
};

export const TRANSACTION_SUCCESS = (bountyAddress) => {
	return {
		bountyAddress,
		isBountyMinted: true,
		isLoading: false,
		transactionPending: false
	};
};

export const TRANSACTION_FAILURE = (error) => {
	return {
		error: error,
		errorMessage: error.message,
		isBountyMinted: false,
		isLoading: false,
		transactionPending: false
	};
};