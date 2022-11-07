// Third Party
import React from 'react';
import Link from 'next/link';

// Custom
import WatchButton from '../WatchButton/WatchButton';

const RepoTitle = ({ bounty }) => {
  return (
    <div className='flex items-center justify-between pb-5 w-full px-2 sm:px-8'>
      <div className='flex items-center gap-2'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16' className='fill-muted'>
          <path
            fillRule='evenodd'
            d='M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z'
          ></path>
        </svg>
        <div className='text-xl'>
          {bounty.owner && (
            <span>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${bounty.owner}`}
                data-testid='repo'
                className='text-link-colour hover:underline'
              >
                {bounty.owner}
              </Link>
              <span className='text-muted'> / {bounty.repoName}</span>
            </span>
          )}
        </div>
      </div>
      <WatchButton bounty={bounty} />
    </div>
  );
};
export default RepoTitle;
