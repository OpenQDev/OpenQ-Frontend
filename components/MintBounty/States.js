export const RESTING_STATE = () => {
	return {
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
		error: false,
		errorMessage: '',
		isBountyMinted: false,
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
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
		error: false,
		errorMessage: '',
		isBountyMinted: false,
		isLoading: false,
		isValidUrl: false,
		issueClosed: false,
		issueData: '',
		issueFound: false,
		issueId: '',
		issueNumber: '',
		orgName: '',
		repoName: '',
		transactionPending: false
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
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
		error: true,
		errorMessage: error.message,
		isBountyMinted: false,
		isLoading: false,
		isValidUrl: false,
		issueClosed: false,
		issueData: '',
		issueFound: false,
		issueId: '',
		issueNumber: '',
		orgName: '',
		repoName: '',
		transactionPending: false
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
		error: false,
		errorMessage: '',
		isBountyMinted: false,
		isLoading: false,
		transactionPending: false
	};
};

export const ISSUE_NOT_FOUND = (error) => {
	return {
		issueFound: false
	};
};

export const BOUNTY_MINTED = () => {
	return {
		bounty: null,
		bountyAddress: '',
		bountyExists: false,
		error: false,
		errorMessage: '',
		isBountyMinted: false,
		isLoading: false,
		isValidUrl: false,
		issueClosed: false,
		issueData: '',
		issueFound: false,
		issueId: '',
		issueNumber: '',
		orgName: '',
		repoName: '',
		transactionPending: false
	};
};