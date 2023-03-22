import React, { useReducer } from 'react';
import HackathonReducer from './HackathonReducer';
import HackathonContext from './HackathonContext';
import InitialState from './InitialHackathonState.js';

const HackathonProvider = ({ children, hackathon, githubRepository }) => {
  let startDate = new Date().toISOString().split('T')[0];
  let endDate = new Date().toISOString().split('T')[0];
  let city = hackathon?.city || 'virtual';
  if (hackathon?.startDate && hackathon?.endDate) {
    startDate = new Date(parseInt(hackathon.startDate)).toISOString().split('T')[0];
    endDate = new Date(parseInt(hackathon.endDate)).toISOString().split('T')[0];
  }
  const fetchedValues = { repositoryUrl: githubRepository?.url, startDate, endDate, city };
  const [state, dispatch] = useReducer(HackathonReducer, { ...InitialState, ...hackathon, ...fetchedValues });
  console.log(state, 'state');

  return <HackathonContext.Provider value={[state, dispatch]}>{children}</HackathonContext.Provider>;
};

export default HackathonProvider;
