import React, { useReducer } from 'react';
import MintReducer from './MintReducer.js';
import MintContext from './MintContext';
import InitialState from './InitialMintState.js';

const MintProvider = ({ children, type }) => {
  const [state, dispatch] = useReducer(MintReducer, { type, ...InitialState });

  return <MintContext.Provider value={[state, dispatch]}>{children}</MintContext.Provider>;
};

export default MintProvider;
