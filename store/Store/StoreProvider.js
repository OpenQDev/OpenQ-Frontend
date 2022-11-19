import React, { useReducer, useEffect, useState } from 'react';
import StoreReducer from './StoreReducer';
import StoreContext from './StoreContext';
import InitialState from './InitialState';
import { useWeb3React } from '@web3-react/core';

// The oauthToken here comes from _app.js.
// whatever [page].js is being rendered will pass pageProps to _app.js containing the oauthToken
const StoreProvider = ({ children, oauthToken }) => {
  const { account } = useWeb3React();
  const [state, dispatch] = useReducer(StoreReducer, InitialState);
  const [triedSig, setTriedSig] = useState();
  useEffect(() => {
    // function to set signed account
    const updateSignedAccount = async (signedAccount) => {
      const payload = {
        type: 'SET_SIGNED_ACCOUNT',
        payload: signedAccount,
      };
      dispatch(payload);
    };

    // function to check if signed then set signed, else get signature, verify, and set signed.
    const updateSignature = async (unSignedAccount) => {
      // isSigning a promise returns the signing result;
      const response = await state.authService.hasSignature(unSignedAccount);
      if (response.data.status === false) {
        try {
          const signature = await state.openQClient.signMessage(unSignedAccount);
          await state.authService.verifySignature(unSignedAccount, signature);
          updateSignedAccount(account);
        } catch (error) {
          updateSignedAccount(null);
        }
      } else {
        updateSignedAccount(account);
      }
    };

    // execute
    if (account !== triedSig) {
      setTriedSig(account);
      updateSignature(account);
    }
  }, [account]);

  state.githubRepository.setGraphqlHeaders(oauthToken);

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
