// Third party
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Twitter from '../svg/twitter';

const BountyClosed = ({ bounty, showTweetLink }) => {
  const { tvc } = bounty;
  // Hooks
  const tweetText = `💸 Just claimed a developer bounty from ${bounty.owner} on OpenQ for ${tvc} working on this issue: `;
  const url = `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${bounty.claimedTransactionHash}`;

  //Render
  return (
    <div className='flex px-2 sm:px-0 flex-wrap flex-1  max-w-[1200px] pb-8'>
      <div className='flex-1 pr-4 min-w-[260px] space-y-4 pt-2'>
        <h2 className='flex text-3xl'>This contract is closed.</h2>
        <h3 className='flex text-2xl border-b border-gray-700 pb-4'>
          You cannot initiate actions on a closed contract.
        </h3>
        <div className='flex border-b border-web-gray py-3 gap-2'>
          <div className='font-semibold text-muted'>Linked Closing Transaction</div>
          <div className='flex gap-1 text-primary'>
            <Link href={url} target={'_blank'} rel='noopener norefferer' className='flex items-center gap-1 underline'>
              <>
                <div id={'bounty-link'} className='flex cursor-pointer items-center'>
                  <Image src='/BountyMaterial/polyscan-white.png' width={18} height={18} alt='link-icon' />
                </div>
                <span className='underline pl-1'>view here</span>
              </>
            </Link>
          </div>
        </div>

        {showTweetLink && (
          <div className='flex items-center border-b border-web-gray py-3 gap-4'>
            <div className='font-semibold text-muted'>Tweet about it</div>
            <Link
              href={`https://twitter.com/intent/tweet/?text=${tweetText}${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.bountyAddress}`}
              className='hover:scale-105 animate-single-bounce duration-100'
              target='_blank'
              rel='noopener noreferrer'
            >
              <>
                <Twitter />
              </>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BountyClosed;
