import React, { useReducer } from 'react';
import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';
import InitialState from './InitialState';

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, InitialState);

  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
