import React, { useState, useEffect, useContext } from 'react';
import StoreContext from '../Store/StoreContext';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useAuth from '../../hooks/useAuth';

// manages shared state between auth context and store context
const SetContextState = (props) => {
  const { account } = useWeb3React();
  const [triedSig, setTriedSig] = useState();
  const [authState] = useAuth();
  const [appState, dispatch] = useContext(StoreContext);

  // set signed account
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
      const response = await appState.authService.hasSignature(unSignedAccount);
      if (response.data.status === false) {
        try {
          const signature = await appState.openQClient.signMessage(unSignedAccount);
          await appState.authService.verifySignature(unSignedAccount, signature);
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

  // saves github and account data to openq-api
  useEffect(() => {
    const checkGithub = async () => {
      const signedAccount = appState.signedAccount;
      if (Object.prototype.hasOwnProperty.call(authState, 'login') && signedAccount) {
        console.log(signedAccount);
        const accountData = await appState.openQPrismaClient.getUser(signedAccount);

        if (!accountData?.github && !accountData?.twitter) {
          const githubUser = await appState.githubRepository.fetchUserById(authState.githubId);
          const twitter = `https://twitter.com/${githubUser.twitterUsername}`;

          const githubUrl = githubUser?.url;
          const params = {
            address: ethers.utils.getAddress(signedAccount),
            ...(githubUrl && { github: githubUrl }),
            ...(twitter && { twitter }),
          };

          // get github profile by login

          await appState.openQPrismaClient.updateUserSimple(params);
        }
      }
    };
    if (authState) {
      checkGithub();
    }
  }, [authState, appState.signedAccount]);

  return <>{props.children}</>;
};

export default SetContextState;
