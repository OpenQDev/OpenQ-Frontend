import React, { useReducer } from 'react';
import TokenReducer from './TokenReducer';
import TokenContext from '../TokenStore/TokenContext';
import InitialTokenState from '../TokenStore/InitialTokenState';

const TokenProvider = ({ children, initialToken }) => {
  const token = initialToken ? { ...initialToken } : { token: InitialTokenState.token };
  const [state, dispatch] = useReducer(TokenReducer, { InitialTokenState, ...token });

  return <TokenContext.Provider value={[state, dispatch]}>{children}</TokenContext.Provider>;
};

export default TokenProvider;
