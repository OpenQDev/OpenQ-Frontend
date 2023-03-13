import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import AuthButton from '../../components/Authentication/AuthButton';
import ProPage from '../../components/Pro/ProPage/index.js';

const ProAccount = () => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { id } = accountData;
  return (
    <>
      {id ? (
        <ProPage />
      ) : (
        <>
          <h1 className='text-4xl my-8 col-span-3'>Please sign in to create a Pro Account</h1>

          <AuthButton />
        </>
      )}
    </>
  );
};
export default ProAccount;
