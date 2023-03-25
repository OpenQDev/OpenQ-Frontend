// Third Party
import React, { useState } from 'react';

// Custom
import BountyCardLean from '../../BountyCard/BountyCardLean';
import ProfileTabWrapper from '../ProfileTabWrapper';

const Watching = ({ watchedBounties }) => {
  const [statefulWatched, setStatefulWatched] = useState(watchedBounties);
  const handleRemoveBounty = (index) => {
    const newState = statefulWatched.filter((bounty, i) => i !== index);
    setStatefulWatched(newState);
  };
  return (
    <ProfileTabWrapper title='Watching' message='Bounties you are keeping track of.'>
      {watchedBounties.length > 0 && (
        <div className='py-6 border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
          {statefulWatched.map((bounty, index) => (
            <BountyCardLean
              setStatefulWatched={() => handleRemoveBounty(index)}
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
