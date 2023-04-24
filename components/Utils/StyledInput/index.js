import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';

const StyledInput = ({
  value,
  setValue,
  controlled,
  displayLabel,
  defaultValue,
  key,
  optional,
  type,
  highlightEmpty,
}) => {
  const [appState] = useContext(StoreContext);
  const [localValue, setLocalValue] = useState(defaultValue || '');
  const handleChange = (e) => {
    if (controlled) {
      setValue(e.target.value);
    } else {
      setLocalValue(e.target.value);
    }
  };
  const isNumberOrInteger = type === 'number' || type === 'integer';
  const displayType = isNumberOrInteger ? 'number' : 'text';
  return (
    <div className=' text-sm justify-between my-4'>
      <label className='block font-semibold mb-1.5' htmlFor={value}>
        {displayLabel || appState.utils.capitalize(key)} {optional && '(optional)'}
      </label>
      <input
        className={`input-field w-full max-w-[400px] bg-input-bg px-3 py-[5px] border-border-muted ${
          highlightEmpty && 'invalid:border-danger'
        }`}
        onChange={handleChange}
        value={controlled ? value : localValue}
        required={!optional}
        step={type === 'number' ? '0.01' : type === 'integer' ? '1' : null}
        type={displayType}
        id={value}
      ></input>
    </div>
  );
};
export default StyledInput;
