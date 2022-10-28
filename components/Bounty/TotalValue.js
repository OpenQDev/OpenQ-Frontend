// Third party
import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const TotalValue = ({ price, bounty }) => {
  const [appState] = useContext(StoreContext);
  return (
    <div className='text-base font-semibold text-primary'>
      {bounty.status !== '0' && bounty.tvc ? (
        <>
          <div>Total Value Claimed</div>
          <div className='text-sm font-normal'> {appState.utils.formatter.format(bounty.tvc || 0)}</div>
        </>
      ) : (
        <>
          <div>Total Value Locked</div>
          <div className='text-sm font-normal'> {appState.utils.formatter.format(price || 0)}</div>
        </>
      )}
    </div>
  );
};
export default TotalValue;
