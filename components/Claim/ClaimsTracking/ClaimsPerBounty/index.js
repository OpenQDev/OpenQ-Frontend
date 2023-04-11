import Link from 'next/link';
import React from 'react';
import Github from '../../../svg/github';
import IndividualClaim from './IndividualClaim';

const ClaimsPerBounty = ({ item }) => {
  console.log('item', item);
  return (
    <div className='flex flex-col mb-4'>
      <div className='flex items-center gap-4 mb-2'>
        {item.alternativeName && (
          <div className='break-word text-xl inline gap-1 pb-1'>
            <span className='whitespace-nowrap  text-link-colour hover:underline'>{item.alternativeName}</span>
          </div>
        )}
        <Link href={`/contract/${item?.bountyId}/${item?.bountyAddress}`} target='_blank'>
          <div className='font-bold text-lg text-link-colour hover:underline'>{item?.title || ''}</div>
        </Link>
        <Link href={item?.url} target='_blank'>
          <Github />
        </Link>
      </div>
      <div className='items-center gap-4 grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-web-gray pb-2 mb-2 font-bold'>
        <div className=''>TierWinner</div>
        <div className='flex justify-center'>PayoutSchedule</div>
        <div className='flex justify-center'>W8/W9 Completed</div>
        <div className='flex justify-center'>Claimed</div>
      </div>
      {item.payoutSchedule?.map((payout, index) => {
        return (
          <div key={index}>
            {' '}
            <IndividualClaim bounty={item} index={index} payout={payout} />{' '}
          </div>
        );
      })}
    </div>
  );
};

export default ClaimsPerBounty;
