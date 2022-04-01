const AuthReducer = (state, action) => {
	switch (action.type) {
	case 'UPDATE_IS_AUTHENTICATED':
		return {
			...state,
			isAuthenticated: action.payload.isAuthenticated,
			avatarUrl: action.payload.avatarUrl,
		};
	case 'LOGOUT':
		return {
			...state,
			isAuthenticated: action.payload,
			avatarUrl: null,
		};
	default:
		return state;
	}
};

export default AuthReducer;
