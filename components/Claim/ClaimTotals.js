import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const ClaimTotals = ({ valueDisplay, totalDepositValue }) => {
  const [appState] = useContext(StoreContext);
  return (
    <div className='flex gap-2 px-2 pb-2 w-full'>
      <div className='px-2 pb-2'>
        <div className='flex justify-end w-16'>{((valueDisplay / totalDepositValue) * 100).toFixed(1)} %</div>
      </div>
      <div className='px-2 pb-2 w-full'>
        <div className='flex justify-end'>{appState.utils.formatter.format(valueDisplay)}</div>
      </div>
    </div>
  );
};

export default ClaimTotals;
