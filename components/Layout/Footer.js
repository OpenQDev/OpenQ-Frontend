// Third party
import React from 'react';
import { HeartFillIcon } from '@primer/octicons-react';
import Link from 'next/link';
import OpenQSocials from './OpenQSocials';

// Custom
import Image from 'next/image';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className='w-full max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 mt-12 lg:mt-24'>
      <div className='flex justify-between items-end border-b border-slate-600 pb-3'>
        <OpenQSocials />
        <div className='flex flex-col items-end space-y-2'>
          <div className='flex items-center font-semibold font-sans text-3xl'>
            <Image src='/openq-logo-white-2.png' alt='OpenQ' width='31' height='31' className='aspect-square mr-3' />
            OpenQ
          </div>
        </div>
      </div>
      <div className='pt-6 pb-12 flex flex-col lg:flex-row justify-between'>
        <div className='text-slate-400 text-center sm:text-left xl:text-xl grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12 whitespace-nowrap space-y-5 md:space-y-0'>
          <div className='flex flex-col'>
            <div className='font-bold mb-2 text-slate-50'>HELP ME</div>
            <Link href='/'>Organize a hackathon</Link>
            <Link href='/'>Find developers</Link>
            <Link href='/'>Something else</Link>
          </div>
          <div className='flex flex-col'>
            <div className='font-bold mb-2 text-slate-50'>COMPANY</div>
            <Link href='/'>About</Link>
            <Link href='/'>Blog</Link>
            <Link href='/'>Careers</Link>
            <Link href='/'>Terms of Service</Link>
            <Link href='/'>Privacy Policy</Link>
          </div>
          <div className='flex flex-col'>
            <div className='font-bold mb-2 text-slate-50'>RESOURCES</div>
            <Link href='/'>Contact Us</Link>
            <Link href='/'>Docs</Link>
            <Link href='/'>Press Kit</Link>
          </div>
        </div>
        <div className='text-center lg:text-right lg:ml-6 min-w-max mt-12 lg:mt-0'>
          <div className='text-3xl lg:text-4xl font-bold text-slate-800'>
            Made with <HeartFillIcon size={40} className='text-slate-700' /><br />
            for devs, by devs.
          </div>
          <div className='font-bold text-lg mt-2 text-slate-800'>
            in USA, Germany, Canada, Austria,<br />
            Netherlands and Spain.
          </div>
        </div>
      </div>
      <div className='text-xs text-slate-800 flex flex-col items-center justify-center sm:flex-row pb-12 sm:space-x-6'>
        <div>
          Build: production-1.0.22
        </div>
        <div>
          &copy; {year}, <span className='whitespace-nowrap'>OpenQ Labs GmbH</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
