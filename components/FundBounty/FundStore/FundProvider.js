import React, { useReducer } from 'react';
import FundReducer from './FundReducer';
import FundContext from '../FundStore/FundContext';
import InitialState from './InitialFundState.js';

const FundProvider = ({ children, bounty, refreshBounty }) => {
  const [state, dispatch] = useReducer(FundReducer, { bounty, refreshBounty, ...InitialState });

  return <FundContext.Provider value={[state, dispatch]}>{children}</FundContext.Provider>;
};

export default FundProvider;
