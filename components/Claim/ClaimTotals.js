import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const ClaimTotals = ({ valueDisplay, totalDepositValue }) => {
  const [appState] = useContext(StoreContext);
  return (
    <div className='grid grid-cols-[1fr_1fr] px-2 pb-2'>
      <div className='flex justify-end px-1 whitespace-nowrap'>
        {((valueDisplay / totalDepositValue) * 100).toFixed(1)} %
      </div>
      <div className='flex justify-end px-1 whitespace-nowrap'>{appState.utils.formatter.format(valueDisplay)}</div>
    </div>
  );
};

export default ClaimTotals;
