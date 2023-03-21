import React, { useReducer } from 'react';
import ProAccountReducer from './ProReducer';
import ProAccountContext from './ProContext';
import InitialState from './InitialProAccountState';

const ProAccountProvider = ({ children, proAccount }) => {
  const [state, dispatch] = useReducer(ProAccountReducer, {
    ...InitialState,
    proAccount,
  });
  return <ProAccountContext.Provider value={[state, dispatch]}>{children}</ProAccountContext.Provider>;
};

export default ProAccountProvider;
