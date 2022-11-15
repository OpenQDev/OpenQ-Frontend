// Third party
import Link from 'next/link';
import React from 'react';
import Image from 'next/legacy/image';
import WatchButton from '../WatchButton/WatchButton';

const BountyModalHeading = ({ bounty, unWatchable, watchingState }) => {
  return (
    <div className='flex flex-col pr-10 sm:flex-row justify-between px-8 mb-2 p-3'>
      <div className='flex basis-1/4 flex-col mb-2'>
        <span>
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${bounty.owner}`} legacyBehavior>
            <span className='text-link-colour hover:underline cursor-pointer'>{bounty.owner}</span>
          </Link>
          <span className='text-muted'> / {bounty.repoName}</span>
        </span>
        <h2 className='text-xl flex-1 leading-tight md:w-96'>
          <span className='flex text-primary break-word'>{bounty.title} </span>
          <Link href={bounty.url} className='text-muted text font-light' target='_blank' legacyBehavior>
            <div>#{bounty.number}</div>
          </Link>
        </h2>
      </div>
      <div className='min-w-[40px] flex flex-wrap sm:flex-nowrap gap-x-4 gap-y-2'>
        <WatchButton watchingState={watchingState} unWatchable={unWatchable} bounty={bounty} />
        <div className='hidden lg:block'>
          <Image src={bounty.avatarUrl} className='rounded-full' alt='avatarUrl' width='51' height='51' />
        </div>
      </div>
    </div>
  );
};
export default BountyModalHeading;
