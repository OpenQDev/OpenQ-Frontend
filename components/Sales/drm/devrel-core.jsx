import React from 'react';
import Image from 'next/image';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const DevRelCore = () => {
  return (
    <div className='flex flex-col justify-center items-center  lg:text-center lg:px-20 px-8'>
      <Heading className='pt-3 max-w-[560rem] '>Real-time insights, for everything.</Heading>
      <Paragraph className=' pt-5 max-w-[50rem]'>
        OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and enhances
        lorem ipsum.
      </Paragraph>
      <div className='relative containermx-auto lg:px-4 pb-16 pt-10'>
        <div className='flex justify-center items-center border border-gray-300 rounded-sm md:rounded-lg shadow-custom my-4 '>
          <Image
            className='rounded-sm md:rounded-lg'
            src='/landingpage/drm/devrel/devrel-landingpage-image-2.png'
            alt='Centered Image'
            width={1707}
            height={1024}
            style={{
              boxShadow: '20px 25px 50px 55px rgba(36, 0, 255, 0.08)',
            }}
          />
        </div>
        <div
          className='absolute md:top-2/3 top-40 right-0 border border-gray-300 rounded-sm md:rounded-lg opacity-80'
          style={{ transform: 'translateX(30%) translateY(-25%)' }}
        >
          <Image
            className='rounded-sm md:rounded-lg'
            src='/landingpage/drm/devrel/devrel-landingpage-image-1.png'
            alt='Right Float Image'
            width={853}
            height={512}
          />
        </div>
        <div
          className='absolute md:top-2/3 top-40 right-0 rounded-sm md:rounded-lg'
          style={{ transform: 'translateX(30%) translateY(-25%)' }}
        >
          <Image
            className='rounded-sm md:rounded-lg'
            src='/landingpage/drm/devrel/devrel-landingpage-image-1-2.png'
            alt='Right Float Image'
            width={853}
            height={512}
          />
        </div>
      </div>
    </div>
  );
};

export default DevRelCore;
