import Link from 'next/link';
import React from 'react';
import Twitter from '../svg/twitter';

const TweetAbout = ({ tweetText, bounty }) => {
  return (
    <Link
      href={`https://twitter.com/intent/tweet/?text=${tweetText}${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.bountyAddress}`}
      target='_blank'
      rel='noopener noreferrer'
      legacyBehavior
    >
      <div className='flex justify-center items-center btn-primary'>
        <div className='flex justify-center items-center gap-2'>
          <div data-testid='link' className=''>
            Tweet about it
          </div>

          <Twitter className='w-4 inline' />
        </div>
      </div>
    </Link>
  );
};

export default TweetAbout;
