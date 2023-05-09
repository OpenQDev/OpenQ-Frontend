// Third party
import React from 'react';
import useDisplayValue from '../../../hooks/useDisplayValue';

const TotalValue = ({ bounty }) => {
  const bountyValues = useDisplayValue(bounty);
  const displayValue = bountyValues && bountyValues[bountyValues.priorityValue];

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
