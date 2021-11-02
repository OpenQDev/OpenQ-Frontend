import React, { useReducer } from 'react';
import StoreReducer from './StoreReducer';
import StoreContext from './StoreContext';
import InitialState from './InitialState';

const StoreProvider = ({ children }) => {
	const [state, dispatch] = useReducer(StoreReducer, InitialState);

	return (
		<StoreContext.Provider value={[state, dispatch]}>
			{children}
		</StoreContext.Provider>
	);
};

export default StoreProvider;
