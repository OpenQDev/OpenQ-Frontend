import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import ManageProAccountModal from './ManageProAccountModal';

const ProAccountManagement = ({ apiSecret, products }) => {
  const [proAccounts, setProAccounts] = useState([]);

  const [appState] = useContext(StoreContext);

  useEffect(() => {
    const displayUsers = async () => {
      if (apiSecret) {
        try {
          // add pagination if necessary
          const limit = 400;
          const pros = await appState.openQPrismaClient.getProAccounts(apiSecret, limit);

          setProAccounts(pros);
        } catch (error) {
          console.log(error);
        }
      }
    };

    displayUsers();
  }, [apiSecret]);
  return (
    <div>
      {proAccounts.map((proAccount, index) => {
        return <ManageProAccountModal apiSecret={apiSecret} key={index} proAccount={proAccount} products={products} />;
      })}
    </div>
  );
};
export default ProAccountManagement;
