import React from 'react';

// Custom
import BountyList from '../BountyList/BountyList';
import RepoCard from './RepoCard';

const OrganizationContent = ({
  bounties,
  isLoading,
  getMoreData,
  complete,
  getNewData,
  repositories,
  organizationData,
}) => {
  console.log(repositories);
  return (
    <div className='max-w-[960px] w-full md:basis-3/4 md:shrink'>
      <h2 className='text-primary w-full mb-2'>Active Repos</h2>
      <div className='grid md:grid-cols-[1fr_1fr] gap-4 pb-5'>
        {repositories.map((repository, index) => (
          <RepoCard key={index} repository={repository} organizationData={organizationData} />
        ))}
      </div>

      <h2 className='text-primary w-full mb-2'>Smart Contracts</h2>
      <BountyList
        contractToggle={true}
        bounties={bounties}
        loading={isLoading}
        getMoreData={getMoreData}
        complete={complete}
        getNewData={getNewData}
        types={['0', '1', '2', '3']}
      />
    </div>
  );
};

export default OrganizationContent;
