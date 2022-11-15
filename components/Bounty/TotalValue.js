// Third party
import React, { useContext } from 'react';
import useDisplayValue from '../../hooks/useDisplayValue';
import StoreContext from '../../store/Store/StoreContext';

const TotalValue = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const displayValue = useDisplayValue(bounty, appState.utils.formatter.format);
  return (
    <div className='text-base font-semibold text-primary'>
      <>
        <div>{displayValue?.valueTypeFull || 'Budget'}</div>
        <div className='text-sm font-normal'>{displayValue?.displayValue || '$0.00'}</div>
      </>
    </div>
  );
};
export default TotalValue;
