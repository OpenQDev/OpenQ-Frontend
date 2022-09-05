// Third Party
import React from 'react';

// Custom
import BountyCardLean from '../../BountyCard/BountyCardLean';

const Watching = ({ watchedBounties }) => {
  return (
    <div className='sm:w-3/4  max-w-[960px] mx-4 sm:mx-auto'>
      {watchedBounties.length > 0 && (
        <div className='py-6 border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
          {watchedBounties.map((bounty, index) => (
            <BountyCardLean unWatchable={true} key={index} bounty={bounty} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watching;
