import React from 'react';
import { ChevronRightIcon } from '@primer/octicons-react';
import Link from 'next/link';
import FlexScrollContainer from './FlexScrollContainer';

export default function Newsletter() {
  return (
    <div className='grid grid-cols-2 gap-24 w-full mt-14 mb-24'>
      <div className='pt-3'>
        <h1 className='leading-tight'>Join upcoming web3 hackathons.</h1>
        <p className='text-4xl text-zinc-400 mt-6'>Subscribe to our newsletter &amp; find out where to build next.</p>
        <div className='flex mt-10'>
          <input
            type='email'
            placeholder='Email'
            className='border rounded-l-2xl w-full text-2xl bg-gray-300 text-gray-900 px-8 py-4 outline-none'
          />
          <button className='bg-gradient-to-r from-cyan-300 to-green-400 !text-white text-2xl font-bold !rounded-r-2xl !rounded-l-none border-none !px-12 !py-4'>
            Subscribe
          </button>
        </div>
      </div>
      <FlexScrollContainer>
        <div className='flex flex-col space-y-5'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Link
              key={i}
              href='/'
              className='flex items-center justify-between border bg-dark-2 border-dark-1 rounded px-10 py-6'
            >
              <div className='text-blue-500 text-xl font-semibold'>Polygon Hackathon</div>
              <div className='text-gray-400 text-xl font-bold'>
                Paris, 22.01.2023
                <ChevronRightIcon className='ml-3 w-6 h-6' />
              </div>
            </Link>
          ))}
        </div>
      </FlexScrollContainer>
    </div>
  );
}
