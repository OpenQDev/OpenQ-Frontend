// Third party
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const BountyClosed = ({ bounty, showTweetLink }) => {
  const [appState] = useContext(StoreContext);
  const [tokenValues] = useGetTokenValues(bounty?.payouts);
  const TVL = appState.utils.formatter.format(tokenValues?.total);
  // Hooks
  const tweetText = `💸 Just claimed a developer bounty from ${bounty.owner} on OpenQ for ${TVL} working on this issue: `;
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
            <Link href={url}>
              <a target={'_blank'} rel='noopener norefferer' className='flex items-center gap-1 underline'>
                <div id={'bounty-link'} className='flex cursor-pointer items-center'>
                  <Image src='/BountyMaterial/polyscan-white.png' width={18} height={18} />
                </div>
                <span className='underline pl-1'>view here</span>
              </a>
            </Link>
          </div>
        </div>

        {showTweetLink && (
          <div className='flex items-center border-b border-web-gray py-3 gap-4'>
            <div className='font-semibold text-muted'>Tweet about it</div>
            <Link
              href={`https://twitter.com/intent/tweet/?text=${tweetText}${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyId}/${bounty.bountyAddress}`}
            >
              <a
                className='hover:scale-105 animate-single-bounce duration-100'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg viewBox='0 0 128 128' width='18' height='18'>
                  <path
                    d='M40.254 127.637c48.305 0 74.719-48.957 74.719-91.403 0-1.39 0-2.777-.075-4.156 5.141-4.547 9.579-10.18 13.102-16.633-4.79 2.602-9.871 4.305-15.078 5.063 5.48-4.02 9.582-10.336 11.539-17.774-5.156 3.743-10.797 6.38-16.68 7.801-8.136-10.586-21.07-13.18-31.547-6.32-10.472 6.86-15.882 21.46-13.199 35.617C41.922 38.539 22.246 26.336 8.915 6.27 1.933 20.94 5.487 39.723 17.022 49.16c-4.148-.172-8.207-1.555-11.832-4.031v.41c0 15.273 8.786 28.438 21.02 31.492a21.596 21.596 0 01-11.863.543c3.437 13.094 13.297 22.07 24.535 22.328-9.305 8.918-20.793 13.75-32.617 13.72-2.094 0-4.188-.15-6.266-.446 12.008 9.433 25.98 14.441 40.254 14.422'
                    fill='#ffffff'
                  ></path>
                </svg>
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BountyClosed;
