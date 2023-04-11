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
            <span className='whitespace-nowrap  text-link-colour'>{item.alternativeName}</span>
          </div>
        )}
        <Link href={`/contract/${item?.bountyId}/${item?.bountyAddress}`} target='_blank'>
          <div className='font-bold text-lg'>{item?.title || ''}</div>
        </Link>
        <Link href={item?.url} target='_blank'>
          <Github />
        </Link>
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
