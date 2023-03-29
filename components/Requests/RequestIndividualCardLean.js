// Third party
import React, { useContext } from 'react';
import Image from 'next/image';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import useDisplayValue from '../../hooks/useDisplayValue';
import { formatVolume, getBountyMarker } from '../../services/utils/lib';

const BountyCardLean = ({ item, loading, index, length }) => {
  // State
  const [appState] = useContext(StoreContext);
  const displayValue = useDisplayValue(item, appState.utils.formatter.format);

  // Hooks
  const token = appState.tokenClient.getToken(item.payoutTokenAddress);

  const marker = getBountyMarker(item, appState.openQClient, appState.accountData.github);
  const volume = formatVolume(item.volumeWon, token);

  // Render
  return (
    <div className={loading ? 'pointer-events-none cursor-normal relative w-full' : 'w-full'}>
      <div
        className={`flex flex-col px-4 py-4 border-web-gray border-x  border-t ${
          index === length - 1 && 'border-b rounded-b-sm'
        } ${index === 0 && 'rounded-t-sm'}`}
      >
        <div className='flex flex-row flex-wrap sm:flex-nowrap justify-between sm:pt-0 text-primary'>
          <div className='w-full  md:w-full'>
            <div className='flex flex-grow flex-row items-center md:space-x-2 sm:pb-0 w-full'>
              <div className='hidden md:block'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className={loading ? '#333' : marker.fill}
                  viewBox='0 0 16 16'
                  width='19'
                  height='19'
                >
                  <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
                  <path
                    fillRule='evenodd'
                    d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
                  ></path>
                </svg>
              </div>
              <div className='break-word text-xl inline gap-1 pb-1'>
                <span className=' ' data-testid='repo'>
                  {item.login}
                </span>
              </div>
            </div>
            <div className='font-bold text-lg'>{item.title}</div>

            <div className='flex flex-row items-center gap-4 text-muted font-semibold'>
              <span>Winner of tier {item.tierWon}</span>
              <Image src={displayValue?.imgSrc || '/crypto-logos/ETH.svg'} alt='avatarUrl' width='12' height='20' />
              <span>
                {volume} {token.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyCardLean;
