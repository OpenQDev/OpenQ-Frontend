import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import ManageTeamAccountModal from './ManageTeamAccountModal';

const TeamAccountManagement = ({ apiSecret, products }) => {
  const [teamAccounts, setTeamAccounts] = useState([]);

  const [appState] = useContext(StoreContext);

  useEffect(() => {
    const displayUsers = async () => {
      if (apiSecret) {
        try {
          // add pagination if necessary
          const limit = 400;
          const pros = await appState.openQPrismaClient.getTeamAccounts(apiSecret, limit);

          setTeamAccounts(pros);
        } catch (error) {
          appState.logger.error(error, 'TeamAccountManagement.js1');
        }
      }
    };

    displayUsers();
  }, [apiSecret]);
  return (
    <div>
      {teamAccounts.map((teamAccount, index) => {
        return (
          <ManageTeamAccountModal apiSecret={apiSecret} key={index} teamAccount={teamAccount} products={products} />
        );
      })}
    </div>
  );
};
export default TeamAccountManagement;
