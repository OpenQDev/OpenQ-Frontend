import React /* , { useContext, useEffect, useState } */ from 'react';
/* import StoreContext from '../../../../../store/Store/StoreContext'; */

const IndividualClaim = ({ payout, bounty, index }) => {
  /*  const appState = useContext(StoreContext);
  const [githubUser, setGithubUser] = useState(undefined);
  useEffect(() => {
    if (bounty.tierWinners[index]) {
      const getGithubUser = async () => {
        const githubUser = await appState.githubRepository.fetchUserById(bounty.tierWinners[index]);
        if (githubUser) setGithubUser(githubUser);
      };
      try {
        getGithubUser();
      } catch (err) {
        appState.logger.error(err, 'IndividualClaim.js');
      }
    }
  }, [bounty]);
  console.log(githubUser, 'githubUser', appState.githubRepository); */
  return (
    <div className='flex items-center gap-4'>
      <div className='text-sm'>TierWinner: {bounty.tierWinners[index] || 'Not Yet Assigned'}</div>
      <div className='text-sm'>Payout: {payout}</div>
      <div className='text-sm'>W8/W9: {bounty.supportingDocumentsCompleted?.[index]?.toString().toUpperCase()}</div>
      <div className='text-sm'>Claimed: {bounty.claims?.some((claim) => claim.tier == index) ? 'TRUE' : 'FALSE'}</div>
    </div>
  );
};

export default IndividualClaim;
