import React, { useReducer } from 'react';
import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';
import InitialState from './InitialState';

const TestAuthProvider = ({ children, StoreProps }) => {
  const TestState = { ...InitialState, ...StoreProps };
  const [state, dispatch] = useReducer(AuthReducer, TestState);

  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};

export default TestAuthProvider;
