import Link from 'next/link';
import React, { useState } from 'react';
import Github from '../../../svg/github';
import IndividualClaim from './IndividualClaim';

const ClaimsPerBounty = ({ item, filters, setFilteredInfo, filteredInfo, winnersInfo }) => {
  const gridFormat = 'grid grid-cols-[2fr_1fr_0.75fr_0.5fr_0.75fr_0.5fr]';
  const [filteredTiers, setFilteredTiers] = useState(Array(item.payoutSchedule?.length).fill(true));
  return (
    <div
      className={`${
        filteredInfo[item.id]?.filteredCount == 0 && 'hidden'
      } flex flex-col mb-4 lg:min-w-[1000px] overflow-x-auto border border-web-gray rounded-sm p-4`}
    >
      <div className='flex items-center gap-4 mb-2'>
        {item.alternativeName && (
          <div className='break-word text-xl inline gap-1 pb-1'>
            <span className='whitespace-nowrap'>{item.alternativeName}</span>
          </div>
        )}
        <Link href={`/contract/${item?.bountyId}/${item?.bountyAddress}`} target='_blank'>
          <div className='font-bold text-lg text-link-colour hover:underline'>{item?.title || ''}</div>
        </Link>
        <Link href={item?.url} target='_blank'>
          <Github />
        </Link>
      </div>
      <div className={`items-center gap-4 grid ${gridFormat} border-b border-web-gray pb-2 mb-2 font-bold`}>
        <div className=''>TierWinner</div>
        <div className='flex justify-center'>Planned</div>
        <div className='flex justify-center'>W8/W9?</div>
        <div className='flex justify-center'>KYC'd?</div>
        <div className='flex justify-center'>Wallet</div>
        <div className='flex justify-center'>Claimed</div>
      </div>
      {item.payoutSchedule?.map((payout, index) => {
        const key = item.bountyId + index;
        return (
          <div key={key}>
            {' '}
            <IndividualClaim
              bounty={item}
              index={index}
              payout={payout}
              gridFormat={gridFormat}
              filters={filters}
              setFilteredTiers={setFilteredTiers}
              filteredTiers={filteredTiers}
              setFilteredInfo={setFilteredInfo}
              filteredInfo={filteredInfo}
              winnersInfo={winnersInfo}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ClaimsPerBounty;
