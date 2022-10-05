// Third party
import Link from 'next/link';
import React from 'react';
import useWeb3 from '../../hooks/useWeb3';
import { StackIcon } from '@primer/octicons-react';
import Image from 'next/image';
import WatchButton from '../WatchButton/WatchButton';

const BountyModalHeading = ({ bounty, closeModal, unWatchable, watchingState }) => {
  const { safe } = useWeb3();

  return (
    <div className='flex flex-col pr-10 sm:flex-row justify-between px-8 mb-2 p-3'>
      <div className='flex basis-1/4 flex-col mb-2'>
        <span>
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${bounty.owner}`}>
            <a className='text-link-colour hover:underline'>{bounty.owner}</a>
          </Link>
          <span className='text-muted'> / {bounty.repoName}</span>
        </span>
        <h2 className='text-xl flex-1 leading-tight md:w-96'>
          <span className='flex text-primary break-word'>{bounty.title} </span>
          <Link href={bounty.url} className='text-muted text font-light'>
            <a target='_blank' className='text-link-colour hover:underline'>
              #{bounty.number}
            </a>
          </Link>
        </h2>
      </div>
      <div className='min-w-[40px] flex flex-wrap sm:flex-nowrap gap-x-4 gap-y-2'>
        <Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`}>
          <div onClick={closeModal} target={safe ? '_self' : '_blank'} rel='noopener noreferrer'>
            <div className='flex gap-3 items-center text-xs text-primary bg-inactive-gray leading-5 h-7 whitespace-nowrap px-3 py-[3px] w-fit hover:bg-active-gray rounded-sm border hover:border-border-active border-border-gray'>
              <StackIcon size={24} />
              <a className='cursor-pointer'> Full Contract Details</a>
            </div>
          </div>
        </Link>
        <WatchButton watchingState={watchingState} unWatchable={unWatchable} bounty={bounty} />
        <div className='hidden lg:block'>
          <Image src={bounty.avatarUrl} className='rounded-full' alt='avatarUrl' width='51' height='51' />
        </div>
      </div>
    </div>
  );
};
export default BountyModalHeading;
