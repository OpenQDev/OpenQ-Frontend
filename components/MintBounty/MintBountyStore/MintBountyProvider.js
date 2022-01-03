import React, { useReducer } from 'react';
import MintBountyReducer from './MintBountyReducer';
import MintBountyContext from './MintBountyContext';
import InitialState from './InitialState';

const MintBountyProvider = ({ children }) => {
	const [state, dispatch] = useReducer(MintBountyReducer, InitialState);

	return (
		<MintBountyContext.Provider value={[state, dispatch]}>
			{children}
		</MintBountyContext.Provider>
	);
};

export default MintBountyProvider;
