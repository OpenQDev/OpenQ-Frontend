import React from 'react';
import Discord from '../../svg/discord';

const OpenQSocials = () => {
  return (
    <div className='flex bottom-24 left-16 gap-2'>
      <a href={'https://twitter.com/openqlabs'} target={'_blank'} rel='noopener noreferrer'>
        <svg className='w-5 h-5 mt-0.5 fill-primary' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'>
          <path d='M40.254 127.637c48.305 0 74.719-48.957 74.719-91.403 0-1.39 0-2.777-.075-4.156 5.141-4.547 9.579-10.18 13.102-16.633-4.79 2.602-9.871 4.305-15.078 5.063 5.48-4.02 9.582-10.336 11.539-17.774-5.156 3.743-10.797 6.38-16.68 7.801-8.136-10.586-21.07-13.18-31.547-6.32-10.472 6.86-15.882 21.46-13.199 35.617C41.922 38.539 22.246 26.336 8.915 6.27 1.933 20.94 5.487 39.723 17.022 49.16c-4.148-.172-8.207-1.555-11.832-4.031v.41c0 15.273 8.786 28.438 21.02 31.492a21.596 21.596 0 01-11.863.543c3.437 13.094 13.297 22.07 24.535 22.328-9.305 8.918-20.793 13.75-32.617 13.72-2.094 0-4.188-.15-6.266-.446 12.008 9.433 25.98 14.441 40.254 14.422'></path>
        </svg>
      </a>
      <a href={'https://github.com/OpenQDev/'} target={'_blank'} rel='noopener noreferrer'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-6 h-6 fill-primary'
          viewBox='0 0 24 24'
          width='48px'
          height='48px'
        >
          <path d='M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.6,5,2.5,9.3,6.9,10.7v-2.3c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9 c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2 c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3 C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3 c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v3.3c4.1-1.3,7-5.1,7-9.5C22,6.1,16.9,1.4,10.9,2.1z' />
        </svg>
      </a>
      <a href={'https://discord.gg/puQVqEvVXn'} target={'_blank'} rel='noopener noreferrer'>
        <Discord />
      </a>
    </div>
  );
};

export default OpenQSocials;