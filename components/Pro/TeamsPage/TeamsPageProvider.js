import React, { useReducer } from 'react';
import TeamAccountReducer from './TeamsPageReducer';
import TeamAccountContext from './TeamsPageContext';
import InitialState from './InitialProPageState';

const TeamAccountProvider = ({ children, myTeamAccountInfo }) => {
  const { adminOrganizations } = myTeamAccountInfo;
  const { ownerOrganizations } = myTeamAccountInfo;
  const [state, dispatch] = useReducer(TeamAccountReducer, {
    ...InitialState,
    adminOrganizations: adminOrganizations.nodes,
    ownerOrganizations: ownerOrganizations.nodes,
  });
  return <TeamAccountContext.Provider value={[state, dispatch]}>{children}</TeamAccountContext.Provider>;
};

export default TeamAccountProvider;
