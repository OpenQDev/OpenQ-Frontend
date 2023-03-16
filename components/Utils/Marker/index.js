import React from 'react';
const Marker = ({ colour, text }) => {
  return (
    <div className={`${colour} py-2 font-semibold rounded-full px-4 flex gap-1 items-center content-center  w-fit`}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16' className={`fill-white`}>
        <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
        <path fillRule='evenodd' d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'></path>
      </svg>

      <span className='leading-none relative bottom-0.5'>{text}</span>
    </div>
  );
};
export default Marker;
