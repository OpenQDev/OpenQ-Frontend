import React, { useReducer } from 'react';
import FundReducer from './FundReducer';
import FundContext from './FundContext';
import InitialState from './InitialFundState';

const FundProvider = ({ children, bounty, refreshBounty, setInternalMenu }) => {
  const [state, dispatch] = useReducer(FundReducer, { bounty, refreshBounty, setInternalMenu, ...InitialState });

  return <FundContext.Provider value={[state, dispatch]}>{children}</FundContext.Provider>;
};

export default FundProvider;
