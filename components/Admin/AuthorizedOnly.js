import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import useAuth from '../../hooks/useAuth';

const AuthorizedOnly = ({ children }) => {
  const [appState, dispatch] = useContext(StoreContext);
  const [showPage, setShowPage] = useState();
  const [authState] = useAuth();
  const { account } = useWeb3();

  useEffect(() => {
    console.log(authState);
    if (authState.isAdmin) {
      setShowPage(true);
    }
  }, [authState]);
  const signIn = async () => {
    const signMessage = async () => {
      const message = 'OpenQ';
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });
      return signature;
    };
    const response = await appState.authService.hasSignature(account);

    if (response.data.status === false) {
      const signature = await signMessage();
      await appState.authService.verifySignature(account, signature);

      const payload = {
        type: 'RELOAD_NOW',
        payload: Date.now(),
      };

      dispatch(payload);
    }
  };
  return (
    <div className='flex justify-center mt-1'>
      {showPage ? (
        { ...children }
      ) : (
        <div className='flex flex-col content-center justify-center gap-4 items-center min-h-[calc(100vh_-_246px)] text-xl font-semibold  text-muted'>
          <div>signed in account does not have access to this page.</div>
          <button className='btn-primary px-4' onClick={signIn}>
            sign in with ethereum
          </button>
        </div>
      )}
    </div>
  );
};
export default AuthorizedOnly;
