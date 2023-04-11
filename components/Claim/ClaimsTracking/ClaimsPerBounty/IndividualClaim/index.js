import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import Link from 'next/link';
import { ethers } from 'ethers';

const IndividualClaim = ({ payout, bounty, index }) => {
  const appState = useContext(StoreContext);
  const token = appState[0].tokenClient.getToken(bounty?.payoutTokenAddress);
  const formattedToken = ethers.utils.formatUnits(
    ethers.BigNumber.from(payout.toString()),
    parseInt(token.decimals) || 18
  );
  const [githubUser, setGithubUser] = useState('');
  useEffect(() => {
    if (bounty.tierWinners[index]) {
      const getGithubUser = async () => {
        const githubUser = await appState[0].githubRepository.fetchUserById(bounty.tierWinners[index]);
        if (githubUser) setGithubUser(githubUser);
      };
      try {
        getGithubUser();
      } catch (err) {
        appState.logger.error(err, 'IndividualClaim.js');
      }
    }
  }, [bounty]);
  console.log(bounty, token);
  return (
    <div className='items-center gap-4 grid grid-cols-[2fr_1fr_1fr_1fr]'>
      {githubUser?.url ? (
        <Link href={githubUser?.url} target='_blank' className=' text-link-colour hover:underline '>
          {githubUser.id}
        </Link>
      ) : (
        <div className=' text-red-400'> Not Yet Assigned</div>
      )}
      <div className='flex justify-center'>
        {formattedToken} {token.symbol}
      </div>
      <div className={`flex justify-center ${bounty.supportingDocumentsCompleted?.[index] ? '' : 'text-red-400'}`}>
        {bounty.supportingDocumentsCompleted?.[index]?.toString().toUpperCase()}
      </div>
      <div
        className={`flex justify-center ${bounty.claims?.some((claim) => claim.tier == index) ? '' : 'text-red-400'}`}
      >
        {bounty.claims?.some((claim) => claim.tier == index) ? 'TRUE' : 'FALSE'}
      </div>
    </div>
  );
};

export default IndividualClaim;
