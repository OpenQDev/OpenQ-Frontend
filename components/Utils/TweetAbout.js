import Link from 'next/link';
import React from 'react';
import Twitter from '../svg/twitter';

const TweetAbout = ({ tweetText, bounty }) => {
  return (
    <Link
      href={`https://twitter.com/intent/tweet/?text=${tweetText}${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.bountyAddress}`}
    >
      <a className='hover:scale-105 animate-single-bounce duration-100' target='_blank' rel='noopener noreferrer'>
        <div className='flex justify-center items-center m-5 btn-primary'>
          <div className='flex justify-center items-center gap-2'>
            <div className=''>Tweet about it</div>

            <Twitter className='w-4 inline' />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default TweetAbout;
