import React from 'react';

// Custom
import BountyList from '../BountyList';
import RepoCard from './RepoCard';

const OrganizationContent = ({ repositories, organizationData, paginationObj }) => {
  return (
    <div className='max-w-[960px] w-full md:basis-3/4 md:shrink'>
      <h2 className='text-primary w-full mb-2'>Active Repos</h2>
      <div className='grid md:grid-cols-[1fr_1fr] gap-4 pb-5'>
        {repositories.map((repository, index) => (
          <RepoCard key={index} repository={repository} organizationData={organizationData} />
        ))}
      </div>

      <h2 className='text-primary w-full mb-2'>Smart Contracts</h2>
      <BountyList paginationObj={paginationObj} contractToggle={true} types={['0', '1', '2', '3']} />
    </div>
  );
};

export default OrganizationContent;
