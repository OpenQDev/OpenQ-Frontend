const AuthReducer = (state, action) => {
	console.log(action);
	if(process.env.NEXT_PUBLIC_DEPLOY_ENV === 'local'){
		return {
			isAuthenticated: true
		};
	}
	
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
		
	case 'UPDATE_SIGNED_ACCOUNT':
		return {
			...state,
			signedAccount: action.payload.addressRecovered
		};
	default:
		return state;
	}
};

export default AuthReducer;
