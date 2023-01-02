// Third party
import React from 'react';

// Custom
import BountyList from '../../BountyList/BountyList';
import UnexpectedErrorModal from '../../Utils/UnexpectedErrorModal';

const BountyHomepage = ({
  bounties,
  watchedBounties,
  loading,
  complete,
  getMoreData,
  getNewData,
  error,
  category,
  types,
  contractToggle,
}) => {
  const title =
    category === 'split-price'
      ? 'Split Price Contracts'
      : category === 'contest'
      ? 'Contests'
      : 'Fixed Price Contracts';
  // Render
  return (
    <div>
      <div className='text-center bg-[#161B22] py-14 '>
        <div className='text-2xl font-bold'>Explore Issues</div>
        <div className='text-gray-500 text-md'>GitHub issues backed by OpenQ {title || 'escrows'}.</div>
      </div>
      <div className='lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center md:pr-3 pt-10'>
        {error ? (
          <UnexpectedErrorModal error={error} />
        ) : (
          <BountyList
            bounties={bounties}
            watchedBounties={watchedBounties}
            addCarousel={true}
            loading={loading}
            getMoreData={getMoreData}
            complete={complete}
            getNewData={getNewData}
            types={types}
            contractToggle={contractToggle}
          />
        )}
      </div>
    </div>
  );
};

export default BountyHomepage;
