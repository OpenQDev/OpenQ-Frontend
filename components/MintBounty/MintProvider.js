import React, { useReducer } from 'react';
import MintReducer from './MintReducer.js';
import MintContext from './MintContext';
import InitialState from './InitialMintState.js';

const MintProvider = ({ children, types }) => {
  const category =
    types[0] === '1'
      ? 'Split Price'
      : types[0] === '2'
      ? 'Contest'
      : types[0] === '3'
      ? 'Fixed Contest'
      : 'Fixed Price';
  console.log('inital category', category);
  const [state, dispatch] = useReducer(MintReducer, { category, ...InitialState });

  return <MintContext.Provider value={[state, dispatch]}>{children}</MintContext.Provider>;
};

export default MintProvider;
