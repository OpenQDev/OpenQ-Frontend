import React from 'react';
import WinnerSelect from './WinnerSelect';

const SubmissionCardAdmin = ({ bounty, pr, refreshBounty }) => {
  const claimedArr = bounty.claims.map((claim) => parseInt(claim.tier));
  const payoutAndIndex = bounty.payoutSchedule.map((payout, index) => {
    const claimed = claimedArr.includes(index);
    return {
      claimed,
      index,
      payout,
    };
  });
  const firstPrize = payoutAndIndex[0];
  const evenPrizes = payoutAndIndex
    .filter((elem, index) => {
      return index % 2 === 0 && index !== 0;
    })
    .reverse();

  const oddPrizes = payoutAndIndex.filter((elem, index) => {
    return index % 2 !== 0;
  });
  return (
    <div className='border-web-gray border-t px-2'>
      <h4 className='py-4 text-center w-full font-medium text-xl'>Select Winner</h4>
      <div className='flex w-full'>
        {evenPrizes.map((payout, index) => {
          return (
            <WinnerSelect pr={pr} bounty={bounty} numberOfPayouts={payoutAndIndex.length} prize={payout} key={index} />
          );
        })}
        <WinnerSelect
          pr={pr}
          bounty={bounty}
          numberOfPayouts={payoutAndIndex.length}
          prize={firstPrize}
          key={firstPrize.index}
        />
        {oddPrizes.map((payout, index) => {
          return (
            <WinnerSelect
              refreshBounty={refreshBounty}
              pr={pr}
              bounty={bounty}
              numberOfPayouts={payoutAndIndex.length}
              prize={payout}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionCardAdmin;
