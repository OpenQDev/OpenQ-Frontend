// Third party
import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import AuthContext from '../../store/AuthStore/AuthContext';
import StoreContext from '../../store/Store/StoreContext';

// Custom

const BountyStatus = ({ bounty }) => {
  const [appState] = useContext(StoreContext);

  const [authState] = useContext(AuthContext);
  const marker = appState.utils.getBountyMarker(bounty, authState.login);

  return (
    <div className='w-full'>
      <div className='font-semibold text-primary text-base my-3 pr-3'>Status</div>
      <div className='flex flex-row space-x-2 text-primary text-base'>
        <div className=' pt-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`relative bottom-0.5 ${marker.fill}`}
            viewBox='0 0 16 16'
            width='18'
            height='18'
          >
            <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
            <path
              fillRule='evenodd'
              d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
            ></path>
          </svg>
        </div>
        <div>{marker.status}</div>
      </div>
      <div>
        {bounty ? (
          <div className='text-base mb-3 text-primary' suppressHydrationWarning={true}>
            Smart Contract Deployed {appState.utils.formatUnixDate(bounty.bountyMintTime || Date.now() / 1000, true)}
          </div>
        ) : (
          <Skeleton width={'10rem'} />
        )}
      </div>
    </div>
  );
};

export default BountyStatus;
