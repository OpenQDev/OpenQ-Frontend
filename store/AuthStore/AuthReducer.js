const AuthReducer = (state, action) => {
	switch (action.type) {
	case 'UPDATE_IS_AUTHENTICATED':
		return {
			...state,
			isAuthenticated: action.payload,
			_id: 'fakeid'
		};
	case 'LOGOUT':
		return {
			...state,
			isAuthenticated: action.payload,
			_id: 'fakeid'
		};
	default:
		return state;
	}
};

export default AuthReducer;
