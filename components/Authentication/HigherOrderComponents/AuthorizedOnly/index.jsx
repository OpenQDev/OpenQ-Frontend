import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import AuthButton from '../../../Authentication/AuthButton';

const AuthorizedOnly = ({ children }) => {
  const [showPage, setShowPage] = useState();
  const [appState] = useContext(StoreContext);
  const githubId = appState.accountData.github;
  useEffect(() => {
    const updateIsAdmin = async () => {
      const team = 'developers';
      const login = 'OpenQDev';
      const isAdmin = await appState.githubRepository.getIsAdmin(login, team, githubId);
      setShowPage(isAdmin);
    };
    if (githubId) updateIsAdmin();
  }, [githubId]);

  return (
    <div className='flex justify-center mt-1'>
      {showPage ? (
        { ...children }
      ) : (
        <div className='flex flex-col content-center justify-center gap-4 items-center min-h-[calc(100vh_-_246px)] text-xl font-semibold  text-muted'>
          <div>
            You must be oauthed with an account that belongs to the OpenQ Github organization to view this page.
          </div>
          <AuthButton />
        </div>
      )}
    </div>
  );
};
export default AuthorizedOnly;
