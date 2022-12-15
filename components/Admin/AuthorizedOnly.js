import React, { useContext, useEffect, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import ConnectButton from '../WalletConnect/ConnectButton';
import AuthContext from '../../store/AuthStore/AuthContext';

const AuthorizedOnly = ({ children }) => {
  const [showPage, setShowPage] = useState();
  const [isSigned, setIsSigned] = useState();
  const [authState] = useContext(AuthContext);
  const { account } = useWeb3();

  useEffect(() => {
    if (authState.isAdmin) {
      setShowPage(true);
    }
    setIsSigned(authState.signedAccount === account);
  }, [authState, account]);

  return (
    <div className='flex justify-center mt-1'>
      {showPage ? (
        { ...children }
      ) : (
        <div className='flex flex-col content-center justify-center gap-4 items-center min-h-[calc(100vh_-_246px)] text-xl font-semibold  text-muted'>
          <div>
            {isSigned
              ? 'signed in account does not have access to this page. Please switch to an account that does then sign in.'
              : 'current account not signed in'}
          </div>
          <ConnectButton />
        </div>
      )}
    </div>
  );
};
export default AuthorizedOnly;
