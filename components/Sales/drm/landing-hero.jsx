import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';

export default function Header() {
  return (
    <header className='flex md:pb-60 lg:pb-[284px] pb-20  justify-between items-center max-w-screen-2xl mx-auto lg:pt-8 px-4 md:px-12 lg:px-24 relative z-0 md:min-h-[590px]'>
      <div className='lg:pr-10 z-0'>
        <Link href='https://medium.com/openqdev/introducing-openq-on-polygon-1b096f74e949' target='_blank'>
          <div className='flex items-center bg-dark-4 bg-opacity-70 border border-gray-600 rounded-md sm:rounded-full px-3 md:px-6 py-2 mt-8 max-w-2xl'>
            <Image src='/explore/LOGO_colorful.png' width={35} height={34} alt='OpenQ Logo' className='mr-3 shrink-0' />
            <div>
              <div className='font-bold text-[13px]'>Introducing OpenQ: Launching Hackathons & Building the Future</div>
              <div className='text-gray-500 text-[14px]'>
                Read more about OpenQ's builder hub in our recent article and learn what's coming next.
              </div>
            </div>
            <div className='hidden sm:inline ml-10'>
              <ChevronRightIcon className='text-gray-400 w-6 h-6' />
            </div>
          </div>
        </Link>
        <h1 className='text-center mt-10 text-4xl md:text-left md:leading-tight md:text-6xl'>
          A platform where
          <br />
          developers and
          <br />
          businesses thrive
        </h1>
        <p className='text-center max-w-md mx-auto md:mx-0 text-zinc-400 mb-5 text-xl md:text-3xl md:max-w-xl md:text-left mt-5'>
          Engineered for efficiency. Constructed for partnership. Renowned for data-driven insights. Igniting the new
          phase of tech.
        </p>
      </div>
      <Image
        className='opacity-10 -mx-32 md:opacity-30 my-10 xl:opacity-100 absolute xl:static -right-50 top-0 sm:right-0 sm:-top-10 lg:right-20 lg:top-10 z-0 max-w-[400px] sm:max-w-none sm:min-w-[450px]'
        src='/landingpage/hero.png'
        alt='explore planet'
        width={800}
        height={510}
        priority={true}
      />
    </header>
  );
}
