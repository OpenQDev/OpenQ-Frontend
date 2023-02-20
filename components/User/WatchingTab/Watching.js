// Third Party
import React from 'react';

// Custom
import BountyCardLean from '../../BountyCard/BountyCardLean';
import ProfileTabWrapper from '../ProfileTabWrapper';

const Watching = ({ watchedBounties }) => {
  return (
    <ProfileTabWrapper title='Watching' message='Bounties you are keeping track of.'>
      {watchedBounties.length > 0 && (
        <div className='py-6 border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
          {watchedBounties.map((bounty, index) => (
            <BountyCardLean
              unWatchable={true}
              key={index}
              length={watchedBounties.length}
              index={index}
              item={bounty}
            />
          ))}
        </div>
      )}
    </ProfileTabWrapper>
  );
};

export default Watching;
