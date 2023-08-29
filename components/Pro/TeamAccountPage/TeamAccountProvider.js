import React, { useReducer } from 'react';
import TeamAccountReducer from './TeamAccountReducer';
import TeamAccountContext from './TeamAccountContext';

const TeamAccountProvider = ({ children, teamAccount }) => {
  const [state, dispatch] = useReducer(TeamAccountReducer, teamAccount);
  return <TeamAccountContext.Provider value={[state, dispatch]}>{children}</TeamAccountContext.Provider>;
};

export default TeamAccountProvider;
