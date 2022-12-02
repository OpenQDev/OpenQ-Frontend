import React, { useReducer } from 'react';
import MintReducer from './MintReducer.js';
import MintContext from './MintContext';
import InitialState from './InitialMintState.js';

// The oauthToken here comes from _app.js.
// whatever [page].js is being rendered will pass pageProps to _app.js containing the oauthToken
const MintProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MintReducer, InitialState);

  return <MintContext.Provider value={[state, dispatch]}>{children}</MintContext.Provider>;
};

export default MintProvider;
