// Third party
import React, { useContext } from 'react';
import Image from 'next/image';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import { formatVolume } from '../../services/utils/lib';

const BountyCardLean = ({ item, loading, index, length }) => {
  // State
  const [appState] = useContext(StoreContext);

  // Hooks
  const token = appState.tokenClient.getToken(item.payoutTokenAddress);

  const volume = formatVolume(item.volumeWon, token);

  // Render
  return (
    <div className={loading ? 'pointer-events-none cursor-normal relative w-full' : 'w-full mt0'}>
      <div
        className={`flex flex-col px-4 py-4 border-web-gray border-x  border-t ${
          index === length - 1 && 'border-b rounded-b-sm'
        } ${index === 0 && 'rounded-t-sm'}`}
      >
        <div className='flex flex-row flex-wrap sm:flex-nowrap justify-between sm:pt-0 text-primary'>
          <div className='w-full  md:w-full'>
            <div className='flex flex-grow flex-row items-center md:space-x-2 sm:pb-0 w-full'>
              <div className='break-word text-xl inline gap-1 pb-1'>
                <span className=' ' data-testid='repo'>
                  {item.login}
                </span>
              </div>
            </div>
            <div className='font-bold text-lg'>{item.title}</div>

            <div className='flex flex-row items-center gap-8 text-muted font-semibold'>
              <span>Winner of tier {item.tierWon}</span>
              <div className='flex gap-2'>
                <span>
                  {volume} {token.symbol}
                </span>
                <Image src={token?.path || '/crypto-logos/ETH.svg'} alt='avatarUrl' width='16' height='16' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyCardLean;
