// Third party
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import WatchButton from '../../WatchButton/WatchButton';

const BountyModalHeading = ({ bounty, unWatchable, watchingState }) => {
  return (
    <div className='flex'>
      <div className='flex flex-col sm:flex-row justify-between w-full px-2'>
        <div className='flex flex-col mb-2 w-full'>
          <div className='flex items-center gap-2 text-lg w-full'>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${bounty.owner}`}>
              <span className='text-link-colour hover:underline cursor-pointer'>{bounty.owner}</span>
            </Link>
            {' / '}
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/repo/${bounty.owner}/${bounty.repoName}`}>
              <span className='text-link-colour hover:underline cursor-pointer'>{bounty.repoName}</span>
            </Link>
          </div>
          <div className='flex-1 leading-tight w-full'>
            <span className='flex text-primary break-word'>{bounty.title} </span>

            <div className='flex gap-12 mt-1 items-center justify-between sm:justify-start'>
              <Link href={bounty.url} className='text-muted text font-light' target='_blank'>
                <div>#{bounty.number}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='sm:flex sm:flex-col items-center hidden sm:pr-8 justify-around'>
        <Image src={bounty.avatarUrl} className='rounded-full' alt='avatarUrl' width='62' height='62' />
        <WatchButton watchingState={watchingState} unWatchable={unWatchable} bounty={bounty} />
      </div>
    </div>
  );
};
export default BountyModalHeading;
