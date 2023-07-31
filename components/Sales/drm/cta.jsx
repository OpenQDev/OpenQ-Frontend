import React from 'react';
import Link from 'next/link';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const Cta = () => {
  return (
    <div>
      <div className='flex flex-col bg-white justify-center items-center text-center  px-8'>
        <Heading className=' pt-3 max-w-[80rem]'>
          Shaped by valuable feedback from over a hundred companies. Join the closed beta waitlist and embrace the
          future of dev rel
        </Heading>
        <Paragraph className='pt-8 max-w-[48rem]'>
          OpenQ is already helping teams just like yours to manage their developer community. Let us help you next.
        </Paragraph>
        <div className='flex flex-row justify-center items center gap-4 md:gap-x-10 pt-16'>
          <Link href='/waitlist'>
            <div className='bg-[#533AED] rounded-lg text-white text-xl font-semibold p-2 px-5 whitespace-nowrap'>
              Join waitlist
            </div>
          </Link>
          <div className='flex flex-row space-x-1 items-center'>
            <div className='relative inline-block'>
              <Link href='/demo'>
                <div className='underline rounded-sm text-black text-xl font-semibold py-1 px-3 whitespace-nowrap'>
                  Schedule demo
                </div>
              </Link>
              <span className='absolute bg-white bottom-0 left-0 h-px w-full'></span>
            </div>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='black'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75' />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;
