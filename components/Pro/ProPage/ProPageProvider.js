import React, { useReducer } from 'react';
import ProAccountReducer from './ProPageReducer';
import ProAccountContext from './ProPageContext.js';
import InitialState from './InitialProPageState';

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
