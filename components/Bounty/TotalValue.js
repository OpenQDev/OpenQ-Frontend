// Third party
import React, { useContext } from 'react';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';

const TotalValue = ({ price, bounty }) => {
  const [appState] = useContext(StoreContext);
  const [payoutPrice] = useGetTokenValues(bounty.payouts);
  return (
    <div className='text-base font-semibold text-primary'>
      {bounty.status !== '0' ? (
        <>
          <div>Total Value Claimed</div>
          <div className='text-sm font-normal'>
            {appState.utils.formatter.format(bounty.tvc || payoutPrice?.total || 0)}
          </div>
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
