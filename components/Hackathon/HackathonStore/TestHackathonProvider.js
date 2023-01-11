import React, { useReducer } from 'react';
import HackathonReducer from './HackathonReducer';
import HackathonContext from '../HackathonStore/HackathonContext';
import InitialState from './InitialHackathonState.js';

const TestHackathonProvider = ({ children, bounty, refreshBounty, StoreProps }) => {
  const [state, dispatch] = useReducer(HackathonReducer, { bounty, refreshBounty, ...InitialState, ...StoreProps });

  return <HackathonContext.Provider value={[state, dispatch]}>{children}</HackathonContext.Provider>;
};

export default TestHackathonProvider;
