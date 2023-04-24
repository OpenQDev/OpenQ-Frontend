import React, { useContext } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import Link from 'next/link';

const CreateAccount = () => {
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
    </>
  );
};
export default CreateAccount;
