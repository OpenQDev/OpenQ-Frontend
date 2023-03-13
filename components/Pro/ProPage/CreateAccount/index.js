import React, { useState, useContext } from 'react';
import CreateAccountModal from '../CreateAccountModal/index.js';
import StoreContext from '../../../../store/Store/StoreContext';
import Link from 'next/link';

const CreateAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const userOwned = accountData.ownerOrganizations.nodes;
  const userAdmined = accountData.adminOrganizations.nodes.filter((value) => {
    return !userOwned.some((owned) => owned.id === value.id);
  });

  return (
    <>
      <div className='border self-stretch justify-stretch border-web-gray w-60 '>
        <h3 className=''>Owned accounts</h3>
        {userOwned.map((value) => {
          return (
            <div key={value.id}>
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/pro/${value.id}`}>{value.name}</Link>
            </div>
          );
        })}
      </div>

      <div className='border self-stretch justify-stretch border-web-gray w-60 '>
        <h3>Admined Accounts</h3>
        {userAdmined.map((value) => (
          <div key={value.id}>
            {' '}
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/pro/${value.id}`}>{value.name}</Link>
          </div>
        ))}
      </div>

      <div className='border self-stretch justify-stretch border-web-gray w-60'>
        <h3>Create Account</h3>
        <button onClick={() => setShowModal(true)}>Open create modal</button>

        <CreateAccountModal showModal={showModal} setShowModal={setShowModal} />
      </div>
    </>
  );
};
export default CreateAccount;
