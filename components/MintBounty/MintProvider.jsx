import React, { useReducer } from 'react';
import MintReducer from './MintReducer';
import MintContext from './MintContext';
import InitialState from './InitialMintState';

const MintProvider = ({ children, type }) => {
  const [state, dispatch] = useReducer(MintReducer, { type: parseInt(type), ...InitialState });

  return <MintContext.Provider value={[state, dispatch]}>{children}</MintContext.Provider>;
};

export default MintProvider;
