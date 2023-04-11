import React, { useReducer } from 'react';
import FundReducer from './FundReducer';
import FundContext from './FundContext';
import InitialState from './InitialFundState';

const TestFundProvider = ({ children, bounty, refreshBounty, StoreProps }) => {
  const [state, dispatch] = useReducer(FundReducer, { bounty, refreshBounty, ...InitialState, ...StoreProps });

  return <FundContext.Provider value={[state, dispatch]}>{children}</FundContext.Provider>;
};

export default TestFundProvider;
