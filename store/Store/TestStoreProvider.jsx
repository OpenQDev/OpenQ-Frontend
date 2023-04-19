import React, { useReducer } from 'react';
import StoreReducer from './StoreReducer';
import StoreContext from './StoreContext';
import InitialState from './InitialState';

// The oauthToken here comes from _app.js.
// whatever [page].js is being rendered will pass pageProps to _app.js containing the oauthToken
const TestStoreProvider = ({ children, StoreProps }) => {
  const TestState = { ...InitialState, ...StoreProps };
  const [state, dispatch] = useReducer(StoreReducer, TestState);

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default TestStoreProvider;
