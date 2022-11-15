// Third party
import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import AuthContext from '../../store/AuthStore/AuthContext';
import StoreContext from '../../store/Store/StoreContext';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

// Custom

const BountyStatus = ({ bounty }) => {
  const [appState] = useContext(StoreContext);

  const [authState] = useContext(AuthContext);
  const marker = appState.utils.getBountyMarker(bounty, authState.login);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex items-center gap-4'>
        <div className='font-semibold text-muted text-base'>Status: </div>
        <div className='flex flex-row space-x-2 text-base'>
          <div className='pt-1.5'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={`relative bottom-0.5 ${marker.fill}`}
              viewBox='0 0 16 16'
              width='16'
              height='16'
            >
              <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
              <path
                fillRule='evenodd'
                d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
              ></path>
            </svg>
          </div>
          <div className='flex space-x-1'>
            <div>{marker.status}</div>
          </div>
        </div>
      </div>
      {bounty ? (
        <div className='flex flex-wrap sm:gap-4 text-base text-muted' suppressHydrationWarning={true}>
          Smart Contract Deployed {appState.utils.formatUnixDate(bounty.bountyMintTime || Date.now() / 1000, true)}:
          <CopyAddressToClipboard data={bounty.bountyAddress} clipping={[5, 37]} styles={'text-primary'} />
        </div>
      ) : (
        <Skeleton width={'10rem'} />
      )}
    </div>
  );
};

export default BountyStatus;
