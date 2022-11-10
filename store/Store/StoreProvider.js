import React, { useReducer } from 'react';
import StoreReducer from './StoreReducer';
import StoreContext from './StoreContext';
import InitialState from './InitialState';

// The oauthToken here comes from _app.js.
// whatever [page].js is being rendered will pass pageProps to _app.js containing the oauthToken
const StoreProvider = ({ children, oauthToken }) => {
	const [state, dispatch] = useReducer(StoreReducer, InitialState);
	state.githubRepository.setGraphqlHeaders(oauthToken);

	return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
