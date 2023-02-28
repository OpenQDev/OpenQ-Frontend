// Third party Libraries
import React, { useState, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';
import BountyClosed from '../BountyClosed';
import SetBudgetAdminPage from './SetBudgetAdminPage';
import SetTierAdminPage from './SetTierAdminPage';
import BountyWrapper from '../Bounty/BountyWrapper';
import TokenProvider from '../TokenSelection/TokenStore/TokenProvider';

const AdminPage = ({ bounty, refreshBounty }) => {
  // Context
  const { account } = useWeb3();

  const [showButton, setShowButton] = useState(
    ethers.utils.getAddress(bounty.issuer.id) == account && bounty.status == '0'
  );

  // funding goal volume and token
  // payout volume and token

  // contest state
  useEffect(() => {
    setShowButton(ethers.utils.getAddress(bounty.issuer.id) == account && bounty.status == '0');
  }, [bounty]);

  return (
    <>
      {showButton ? (
        <BountyWrapper header='Settings'>
          <div className='flex flex-col space-y-4 w-full px-8 pt-2'>
            <h2 className='text-2xl border-b border-gray-700 pb-4'>Modifications</h2>

            <TokenProvider>
              <SetBudgetAdminPage refreshBounty={refreshBounty} bounty={bounty} />
            </TokenProvider>

            <TokenProvider>
              <SetTierAdminPage refreshBounty={refreshBounty} bounty={bounty} />
            </TokenProvider>
          </div>
        </BountyWrapper>
      ) : (
        <BountyClosed bounty={bounty} />
      )}
    </>
  );
};

export default AdminPage;
