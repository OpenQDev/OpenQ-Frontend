import React, { useReducer } from 'react';
import StoreReducer from './StoreReducer';
import StoreContext from './StoreContext';
import InitialState from './InitialState';

const StoreProvider = ({ children, oauthToken }) => {
	console.log('oauthToken in provider', oauthToken);
	const [state, dispatch] = useReducer(StoreReducer, InitialState);
	state.githubRepository.setGraphqlHeaders(oauthToken);

	return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
