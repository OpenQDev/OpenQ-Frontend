import React, { useReducer } from 'react';
import TeamAccountReducer from './ProReducer';
import TeamAccountContext from './ProContext';
import InitialState from './InitialTeamAccountState';

const TeamAccountProvider = ({ children, teamAccount }) => {
  const [state, dispatch] = useReducer(TeamAccountReducer, {
    ...InitialState,
    teamAccount,
  });
  return <TeamAccountContext.Provider value={[state, dispatch]}>{children}</TeamAccountContext.Provider>;
};

export default TeamAccountProvider;
