import React, { useReducer } from 'react';
import HackathonReducer from './HackathonReducer';
import HackathonContext from './HackathonContext';
import InitialState from './InitialHackathonState.js';

const HackathonProvider = ({ children, hackathon, githubRepository }) => {
  const startDate = new Date(parseInt(hackathon.startDate)).toISOString().split('T')[0];
  const endDate = new Date(parseInt(hackathon.endDate)).toISOString().split('T')[0];
  const fetchedValues = { repositoryUrl: githubRepository.url, startDate, endDate };
  const [state, dispatch] = useReducer(HackathonReducer, { ...InitialState, ...hackathon, ...fetchedValues });

  return <HackathonContext.Provider value={[state, dispatch]}>{children}</HackathonContext.Provider>;
};

export default HackathonProvider;
