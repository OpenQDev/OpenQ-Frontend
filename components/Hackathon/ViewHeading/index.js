import React from 'react';
import Marker from '../../Utils/Marker';
import Link from 'next/link';

const ViewHeading = ({ hackathon }) => {
  return (
    <div className='flex justify-between w-full border-b border-web-gray py-4'>
      <div className='w-full flex flex-wrap justify-between'>
        <Marker colour={'bg-claim'} text='Upcoming' />
      </div>
      <div className='flex gap-4 items-center'>
        <div className='w-60 h-min'> Locked Prizes $100,500</div>
        {hackathon.website && (
          <Link href={hackathon.website} className='btn-primary h-min'>
            Attend
          </Link>
        )}
      </div>
    </div>
  );
};

export default ViewHeading;
