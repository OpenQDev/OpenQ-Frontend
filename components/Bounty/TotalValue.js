// Third party
import React, { useContext } from 'react';
import useDisplayValue from '../../hooks/useDisplayValue';
import StoreContext from '../../store/Store/StoreContext';

const TotalValue = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const displayValue = useDisplayValue(bounty, appState.utils.formatter.format);
  return (
    <div className='flex items-center gap-2 py-2 text-base'>
      <>
        <div className='text-muted'>{displayValue?.valueTypeFull || 'Budget'}</div>
        <div className='text-sm font-normal'>{displayValue?.displayValue || '$0.00'}</div>
      </>
    </div>
  );
};
export default TotalValue;
