// Third party
import React, { useContext } from 'react';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';

const TotalValue = ({ price, bounty }) => {
  const [appState] = useContext(StoreContext);
  const [payoutPrice] = useGetTokenValues(bounty.payouts);

  return (
    <div className='flex items-center gap-2 py-2 text-base'>
      {bounty.status !== '0' ? (
        <>
          <div className='text-muted'>Total Value Claimed: </div>
          <div className='text-sm font-normal'>
            {appState.utils.formatter.format(bounty.tvc || payoutPrice?.total || 0)}
          </div>
        </>
      ) : (
        <>
          <div className='text-muted'>Total Value Locked: </div>
          <div className='text-sm font-normal'> {appState.utils.formatter.format(price || 0)}</div>
        </>
      )}
    </div>
  );
};
export default TotalValue;
