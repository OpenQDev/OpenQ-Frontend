import React from 'react';
import WinnerSelectAmounts from './WinnerSelectAmounts';

const SubmissionCardAdmin = ({ bounty, pr, refreshBounty }) => {
  const claimedArr = bounty.claims?.map((claim) => parseInt(claim.tier));
  const payoutAndIndex = bounty.payoutSchedule.map((payout, index) => {
    const claimed = claimedArr?.includes(index);
    return {
      claimed,
      index,
      payout,
    };
  });

  const linkedPrize = bounty?.claims?.filter((claim) => claim.claimantAsset === pr.url)[0];
  return (
    <div className='border-web-gray border-t px-2'>
      <h4 className='py-4 text-center w-full font-medium text-xl'>Select Winner</h4>
      <div className='flex flex-col w-full relative h-48 overflow-y-auto'>
        <>
          {payoutAndIndex.map((payout, index) => {
            return (
              <WinnerSelectAmounts
                pr={pr}
                disabled={linkedPrize}
                bounty={bounty}
                prize={payout}
                key={index}
                refreshBounty={refreshBounty}
              />
            );
          })}
        </>
      </div>
    </div>
  );
};

export default SubmissionCardAdmin;
