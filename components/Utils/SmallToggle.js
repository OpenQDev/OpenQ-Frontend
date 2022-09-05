// Thrid Party
import React from 'react';

const SmallToggle = ({ toggleFunc, toggleVal, names }) => {
  return (
    <div className='flex text-sm rounded-sm overflow-hidden w-fit text-primary '>
      {names.map((name, index) => {
        return (
          <button
            key={index}
            onClick={() => toggleFunc(name)}
            className={`w-fit min-w-[80px] py-[5px] px-4 ${
              index ? 'rounded-r-sm' : 'rounded-l-sm'
            } border whitespace-nowrap ${
              toggleVal === name ? 'bg-secondary-button border-secondary-button' : ' border-web-gray'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
export default SmallToggle;
