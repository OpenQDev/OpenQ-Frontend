import React from 'react';
import Link from 'next/link';
import Heading from './base/heading';
import Paragraph from './base/paragraph';
import Typeform from './base/typeform';

const Cta = () => {
  return (
    <div>
      <div className='flex flex-col bg-white justify-center items-center lg:text-center  px-8'>
        <Heading className=' pt-3 max-w-[80rem]'>Built by DevRels for DevRels</Heading>
        <Paragraph className='pt-8 max-w-[48rem]'>
          The OpenQ DRM is shaped by valuable feedback from over a hundred companies. <br/><br/><br/><br/>Join our closed beta waitlist and
          embrace the future of dev rel.
        </Paragraph>
        <div className='flex flex-col sm:flex-row justify-center items center gap-8 md:gap-x-10 pt-16'>
          <Typeform>
            <div className='bg-[#533AED] self-start rounded-lg text-white text-xl font-semibold p-2 px-10 w-full whitespace-nowrap'>
              Join waitlist
            </div>
          </Typeform>
          <div className='flex flex-row space-x-1 px-10 items-center'>
            <div className='relative inline-block'>
              <Link href='https://calendly.com/ricketh/openqdemo'>
                <div className='underline rounded-sm text-black text-xl font-semibold py-1 pr-3 whitespace-nowrap'>
                  Schedule demo
                </div>
              </Link>
              <span className='absolute bg-white bottom-0 left-0 h-px w-full'></span>
            </div>
            <div className='sm:block hidden'>
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
