import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';

export default function Header() {
  return (
    <header className='flex justify-between items-center max-w-screen-2xl mx-auto lg:pt-24 lg:pb-12 px-5 lg:px-10'>
      <div>
        <Link href='https://medium.com/openqdev/introducing-openq-on-polygon-1b096f74e949' target='_blank'>
          <div className='flex items-center bg-dark-4 border border-gray-600 rounded-md sm:rounded-full px-3 md:px-6 py-2 mt-5 max-w-2xl'>
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
        <h1 className='max-w-2xl mt-5'>The New Universe For Builders</h1>
        <p className='max-w-xl text-zinc-400 lead mb-5'>
          Join the ultimate hub for builders and turn your ideas into reality.
        </p>
      </div>
      <Image className='hidden lg:block' src='/explore/planet.png' alt='' width={571} height={587} />
    </header>
  );
}
