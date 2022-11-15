// Third party
import Link from 'next/link';
import React from 'react';
import Image from 'next/legacy/image';
import WatchButton from '../WatchButton/WatchButton';

const BountyModalHeading = ({ bounty, unWatchable, watchingState }) => {
  return (
    <div className='flex'>
      <div className='flex flex-col sm:flex-row justify-between w-full px-2'>
        <div className='flex flex-col mb-2 w-full'>
          <div className='flex items-center gap-2 text-lg w-full'>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${bounty.owner}`}>
              <span className='text-link-colour hover:underline cursor-pointer'>{bounty.owner}</span>
            </Link>
            <span className='text-muted'> / {bounty.repoName}</span>
          </div>
          <div className='flex-1 leading-tight w-full'>
            <span className='flex text-primary break-word'>{bounty.title} </span>

            <div className='flex gap-12 mt-1 items-center'>
              <Link href={bounty.url} className='text-muted text font-light' target='_blank'>
                <div>#{bounty.number}</div>
              </Link>
              <WatchButton watchingState={watchingState} unWatchable={unWatchable} bounty={bounty} />
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center pr-8'>
        <Image src={bounty.avatarUrl} className='rounded-full' alt='avatarUrl' width='62' height='62' />
      </div>
    </div>
  );
};
export default BountyModalHeading;
