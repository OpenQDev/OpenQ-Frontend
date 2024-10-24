import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';

export default function Header() {
  return (
    <header className='flex flex-col sm:flex-row md:pb-28  pb-8  justify-between items-center max-w-screen-2xl mx-auto lg:pt-16 md:px-12 lg:px-24 relative z-0 md:min-h-[590px]'>
      <div className='lg:pr-10 z-10'>
        <Link href='/blog/drm-launch' target='_blank'>
          <div className='flex items-center bg-dark-4 bg-opacity-70 border border-gray-600 rounded-full sm:rounded-full px-3 md:px-6 py-2 mt-10 w-fit'>
            <Image src='/explore/LOGO_colorful.png' width={35} height={34} alt='OpenQ Logo' className='mr-3 shrink-0' />
            <div>
              <div className='font-bold text-[13px]'>Introducing OpenQ DRM</div>
              <div className='text-gray-500 text-[14px]'>Your DevRel management platform</div>
            </div>
            <div className=' sm:inline ml-2 sm:ml-10'>
              <ChevronRightIcon className='text-gray-400 w-6 h-6' />
            </div>
          </div>
        </Link>
        <h1 className='text-left sm:text-center mt-10 text-4xl md:text-left md:leading-tight md:text-5xl lg:w-[44rem]'>
          Orchestrating the global symphony of developers, code and <span className='whitespace-nowrap'>dev rels</span>
        </h1>
        <p className='text-left sm:text-center max-w-md w-full  sm:mx-auto md:mx-0 text-zinc-400 mb-5 text-xl md:text-3xl md:max-w-xl md:text-left mt-5'>
          Building powerful infrastructure around developers hubs for growth and innovation.
        </p>
      </div>
      <Image
        className=' hidden sm:block -mx-32 sm:opacity-30 mt-20 sm:mt-10 sm:mb-10 xl:opacity-100 order-1 sm:order-2 sm:absolute xl:static -right-50 top-0 sm:right-0 sm:-top-10 lg:right-20 lg:top-10 z-0 max-w-[400px] sm:max-w-none sm:min-w-[450px]'
        src='/landingpage/hero.png'
        alt='explore planet'
        width={800}
        height={510}
        priority={true}
      />
    </header>
  );
}
