const AuthReducer = (state, action) => {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'local') {
    return {
      isAuthenticated: true,
    };
  }

  switch (action.type) {
    case 'UPDATE_IS_AUTHENTICATED':
      return {
        ...state,
        login: action.payload.login,
        isAuthenticated: action.payload.isAuthenticated,
        avatarUrl: action.payload.avatarUrl,
        githubId: action.payload.githubId,
        email: action.payload.email,
      };
    case 'LOGOUT':
      return {
        ...state,
        login: null,
        isAuthenticated: action.payload,
        avatarUrl: null,
      };
    case 'UPDATE_SIGNED_ACCOUNT':
      return {
        ...state,
        signedAccount: action.payload.addressRecovered,
        isAdmin: action.payload.isAdmin,
      };
    case 'IS_NEW_USER':
      return {
        ...state,
        isNewUser: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
