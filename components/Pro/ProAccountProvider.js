import React, { useReducer } from 'react';
import ProAccountReducer from './ProAccountReducer';
import ProAccountContext from './ProAccountContext.js';
import InitialState from './InitialProAccountState';

const ProAccountProvider = ({ children, myProAccountInfo }) => {
  const { adminOrganizations } = myProAccountInfo;
  const { ownerOrganizations } = myProAccountInfo;
  const [state, dispatch] = useReducer(ProAccountReducer, {
    ...InitialState,
    adminOrganizations: adminOrganizations.nodes,
    ownerOrganizations: ownerOrganizations.nodes,
  });
  return <ProAccountContext.Provider value={[state, dispatch]}>{children}</ProAccountContext.Provider>;
};

export default ProAccountProvider;
