import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';
import Typeform from '../Sales/drm/base/typeform';

const Subnav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <div className={`flex flex-row justify-between md:justify-start relative z-20 text-gray-900  items-center py-4`}>
        <div className='hidden md:flex px-12 gap-2 content-center items-center flex-1'>
          <Link href='/' className='text-md font-extrabold'>
            Products
          </Link>
          <ChevronRightIcon />
          <Link className='font-semibold' href='/drm'>
            DRM
          </Link>
        </div>
        <div className='hidden md:flex px-12 gap-8'>
          <Link className='self-end' href='https://calendly.com/ricketh/openqdemo'>
            <div className='underline rounded-sm text-black text-xl font-semibold py-1 px-3'>Schedule demo</div>
          </Link>
          <Typeform>
            <div className='bg-[#533AED] rounded-lg text-white text-xl font-semibold p-1 px-5'>Join waitlist</div>
          </Typeform>
        </div>
        <div className='md:hidden  flex-1 flex justify-end pr-6'>
          <button className='bg-black' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6 '
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
                className='w-6 h-6 '
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className='flex flex-col relative z-20 pb-7 md:hidden'>
          <a href='#' className='text-gray-900 px-3 text-md font-normal pl-6 pb-5'>
            Home
          </a>
          <a href='#' className='text-gray-900 px-3 text-md font-normal pl-6 pb-5'>
            Schedule a Demo
          </a>
          <Typeform>
            <div className='text-gray-900 justify-self-start px-3 text-md font-normal pl-6'>Join waitlist</div>
          </Typeform>
        </div>
      )}

      <div className='absolute inset-0 border-b border-slate-200  bg-white drop-shadow-md'></div>
    </div>
  );
};

export default Subnav;
