import React from 'react';
import BountyList from '../../BountyList';

const ViewHackathonBounties = ({ paginationObj }) => {
  return (
    <div className='w-full pt-4 flex relative flex-1 pr-16 min-w-[260px]'>
      <BountyList paginationObj={paginationObj} types={['3']} />
    </div>
  );
};

export default ViewHackathonBounties;
