import React, { useReducer } from 'react';
import HackathonReducer from './HackathonReducer';
import HackathonContext from './HackathonContext';
import InitialState from './InitialHackathonState.js';

const HackathonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(HackathonReducer, InitialState);

  return <HackathonContext.Provider value={[state, dispatch]}>{children}</HackathonContext.Provider>;
};

export default HackathonProvider;
