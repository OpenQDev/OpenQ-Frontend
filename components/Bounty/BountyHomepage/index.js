// Third party
import React from 'react';
import { isOnlyContest } from '../../../services/utils/lib';

// Custom
import BountyList from '../../BountyList';
import UnexpectedErrorModal from '../../Utils/UnexpectedErrorModal';

const BountyHomepage = ({ watchedBounties, paginationObj, error, types, contractToggle }) => {
  const isContest = types && isOnlyContest(types);
  // Render
  return (
    <div>
      <div className='text-center bg-[#161B22] py-14 '>
        <div className='text-2xl font-bold'>{isContest ? 'Explore Hackathons' : 'Explore Issues'}</div>
        <div className='text-gray-500 text-md'>
          {isContest ? 'Hackathon bounties backed by OpenQ escrows' : 'GitHub issues backed by OpenQ escrows.'}
        </div>
      </div>
      <div className='lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center md:pr-3 pt-10'>
        {error ? (
          <UnexpectedErrorModal error={error} />
        ) : (
          <BountyList
            watchedBounties={watchedBounties}
            addCarousel={true}
            paginationObj={paginationObj}
            types={types}
            contractToggle={contractToggle}
          />
        )}
      </div>
    </div>
  );
};

export default BountyHomepage;
