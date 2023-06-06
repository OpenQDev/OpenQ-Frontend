import React, { useState } from 'react';

const Subnav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <div className={`flex flex-row justify-between md:justify-start relative z-20 items-center py-5`}>
        <div className='text-2xl px-6 text-black font-extrabold pb-1'>Products</div>
        <div className='hidden md:block'>
          <a href='#' className='text-gray-900 px-3 text-md font-normal'>
            Marketplace
          </a>
          <a href='#' className='text-gray-900 px-3 text-md font-normal'>
            Hackathon Launchpad
          </a>
          <a href='#' className='text-gray-900 px-3 text-md font-normal'>
            Developer Relationship Management
          </a>
        </div>
        <div className='md:hidden self-end pr-6'>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className='flex flex-col relative z-20 pb-7'>
          <a href='#' className='text-gray-900 px-3 text-md font-normal pl-6 pb-5'>
            Marketplace
          </a>
          <a href='#' className='text-gray-900 px-3 text-md font-normal pl-6 pb-5'>
            Hackathon Launchpad
          </a>
          <a href='#' className='text-gray-900 px-3 text-md font-normal pl-6'>
            Developer Relationship Management
          </a>
        </div>
      )}

      <div className='absolute inset-0 border-b border-slate-200  bg-white drop-shadow-md'></div>
    </div>
  );
};

export default Subnav;
