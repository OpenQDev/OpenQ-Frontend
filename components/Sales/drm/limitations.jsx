import React from 'react';

const Limitations = ({ text }) => {
  return (
    <div className='flex flex-row space-x-4'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='2.5'
        stroke='#FF7676'
        className='w-6 h-6'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
      </svg>

      <div className='text-gray-900'>{text}</div>
    </div>
  );
};

export default Limitations;
