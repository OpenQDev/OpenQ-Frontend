const StoreReducer = (state, action) => {
	switch (action.type) {
	case 'UPDATE_IS_AUTHENTICATED':
		return {
			...state,
			isAuthenticated: action.payload,
		};
	case 'UPDATE_ADDRESS':
		return {
			...state,
			publicAddress: action.payload,
		};
	case 'PROVIDER':
		return {
			...state,
			provider: action.payload,
		};
	case 'SIGNER':
		return {
			...state,
			signer: action.payload,
		};
	default:
		return state;
	}
};

export default StoreReducer;
