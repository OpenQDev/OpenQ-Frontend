import React, { useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';

const StyledInput = ({ value, displayValue }) => {
  const [appState] = useContext(StoreContext);
  return (
    <div className='flex justify-between my-2'>
      <label htmlFor={value}>{displayValue || appState.utils.capitalize(value)}</label>
      <input className='input-field' id={value}></input>
    </div>
  );
};
export default StyledInput;
