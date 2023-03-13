// Thrid Party
import React from 'react';

const SmallToggle = ({ toggleFunc, toggleVal, names, className, disabled }) => {
  return (
    <div className={`flex text-sm rounded-sm overflow-hidden w-fit ${className} cursor-not-allowed text-primary `}>
      {names.map((name, index) => {
        return (
          <button
            disabled={disabled}
            key={index}
            onClick={() => toggleFunc(name)}
            className={`w-fit min-w-[80px] py-[5px] px-4 ${
              index ? 'rounded-r-sm' : 'rounded-l-sm'
            } border whitespace-nowrap ${
              toggleVal === name ? 'bg-secondary-button border-secondary-button' : ' border-web-gray'
            } ${disabled ? ' cursor-not-allowed' : ' cursor-pointer'}`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
export default SmallToggle;
