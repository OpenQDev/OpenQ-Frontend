// Third Party
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
// Custom
import MintBountyButton from '../MintBounty/MintBountyButton';
import StoreContext from '../../store/Store/StoreContext';
import useAuth from '../../hooks/useAuth';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const BountyHeading = ({ bounty, price, budget }) => {
  const [appState] = useContext(StoreContext);
  const [authState] = useAuth();
  const [payoutPrice] = useGetTokenValues(bounty.payouts);
  const marker = appState.utils.getBountyMarker(bounty, authState.login);

  return (
    <div className='sm:px-8 px-4 w-full max-w-[1200px] pb-2'>
      <div className='pt-6 pb-2 w-full flex flex-wrap'>
        <h1 className='sm:text-[32px] text-xl flex-1 leading-tight min-w-[240px] pr-20'>
          <span className='text-primary'>{bounty.title} </span>
          {bounty.url ? (
            <Link
              href={bounty.url}
              className='text-muted text font-light'
              rel='noopener norefferer'
              target='_blank'
              legacyBehavior
            >
              #{bounty.number}
            </Link>
          ) : (
            <div>#{bounty.number}</div>
          )}
        </h1>
        <div className='flex flex-row space-x-3 self-start items-center'>
          <div className='flex pt-1'>
            <Link href={bounty.url} target='_blank' legacyBehavior>
              <Image
                src='/social-icons/github-logo-white.svg'
                className='cursor-pointer'
                alt='Picture of the author'
                width={30}
                height={30}
              />
            </Link>
          </div>
          <MintBountyButton types={['0', '1', '2', '3']} styles={'h-8'} wizard={true} />
        </div>
      </div>
      <div className='w-full flex flex-wrap justify-between pb-4 border-b border-web-gray'>
        <div className={`${marker.colour} py-2 font-light rounded-full px-4 flex gap-1  w-fit`}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            width='16'
            height='16'
            className={`fill-white ${marker.colour}`}
          >
            <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
            <path
              fillRule='evenodd'
              d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
            ></path>
          </svg>

          <span className='leading-none'>{marker.status}</span>
        </div>
        <>
          {bounty.status !== '0' ? (
            <span className='leading-loose text-lg font-semibold text-primary'>
              Total Value Claimed {appState.utils.formatter.format(bounty.tvc || payoutPrice?.total || 0)}
            </span>
          ) : price || price === 0 ? (
            <span className='leading-loose text-lg font-semibold text-primary'>
              Total Value Locked {appState.utils.formatter.format(price)}
            </span>
          ) : budget || budget === 0 ? (
            <span className='leading-loose text-lg font-semibold text-primary'>
              Budget {appState.utils.formatter.format(budget)}
            </span>
          ) : null}
        </>
      </div>
    </div>
  );
};
export default BountyHeading;
