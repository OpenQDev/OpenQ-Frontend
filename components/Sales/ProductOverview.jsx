import React from 'react';
import Image from 'next/image';

const ProductOverview = () => {
  return (
    <div className='bg-white'>
      <h1 className='pt-24 text-center text-black text-2xl lg:text-5xl px-10 lg:px-[20rem] xl:px-[25rem] 2xl:px-[30rem] font-bold'>
        Empower your developer communities with our trio of indispensable growth tools.
      </h1>
      <div className='flex flex-col md:flex-row md:space-x-20 space-y-5 justify-center items-center py-5 pt-12'>
        <div className='flex items-end relative'>
          <div className='relative w-[400px] h-[400px] rounded-[3rem] overflow-hidden transition-transform duration-300 hover:scale-105'>
            <Image src='/sales/mp.png' alt='Logo' layout='fill' objectFit='cover' />
            <div className='absolute bottom-9 left-5 pl-4 pb-4 text-white font-bold text-2xl'>
              Developer Marketplace
            </div>
            <div className='flex flex-row space-x-2 items-center absolute top-5 right-5 pr-4 pt-4'>
              <div className=' text-white font-bold text-xl'>Learn more</div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2.5'
                stroke='white'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </div>
            <div className='absolute inset-0 bg-gradient-to-b from-black opacity-25' />
          </div>
        </div>
        <div className='flex items-end relative'>
          <div className='relative w-[400px] h-[400px] rounded-[3rem] overflow-hidden transition-transform duration-300 hover:scale-105'>
            <Image src='/sales/hl.png' alt='Logo' layout='fill' objectFit='cover' />
            <div className='absolute bottom-9 left-5 pl-4 pb-4 text-white font-bold text-2xl'>Hackathon Launchpad</div>
            <div className='flex flex-row space-x-2 items-center absolute top-5 right-5 pr-4 pt-4'>
              <div className=' text-white font-bold text-xl'>Learn more</div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2.5'
                stroke='white'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </div>
            <div className='absolute inset-0 bg-gradient-to-b from-black opacity-25' />
          </div>
        </div>
        <div className='flex items-end relative'>
          <div className='relative w-[400px] h-[400px] rounded-[3rem] overflow-hidden transition-transform duration-300 hover:scale-105'>
            <Image src='/sales/drm.png' alt='Logo' layout='fill' objectFit='cover' />
            <div className='absolute bottom-9 left-5 pl-4 pb-4 text-white font-bold text-2xl'>
              Developer Relationship Management
            </div>
            <div className='flex flex-row space-x-2 items-center absolute top-5 right-5 pr-4 pt-4'>
              <div className='text-white font-bold text-xl'>Learn more</div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2.5'
                stroke='white'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </div>
            <div className='absolute inset-0 bg-gradient-to-b from-black opacity-25' />
          </div>
        </div>
      </div>
      <div className='flex flex-row space-x-2 justify-center pt-12 pb-24 items-center hover:scale-105'>
        <p className='text-center text-black text-xl lg:text-2xl font-medium'>
          Unearth more of our ungoing or future concepts
        </p>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='2.5'
          stroke='black'
          className='w-5 h-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
        </svg>
      </div>
    </div>
  );
};

export default ProductOverview;
