import React from 'react';
import Image from 'next/image';

const DevRelCore = () => {
  return (
    <div className='flex flex-col bg-white justify-center items-center text-center pt-48'>
      <div className='text-black text-4xl font-extrabold pt-3 w-[40rem]'>Real-time insights, for everything.</div>
      <div className='text-gray-800 text-lg pt-5 w-[29rem]'>
        OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and enhances
        lorem ipsum.
      </div>
      <div className='relative container mx-auto px-4 pb-64 pt-10'>
        <div className='flex justify-center items-center border border-gray-300 rounded-lg shadow-custom my-4'>
          <Image
            className='rounded-lg'
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
          className='absolute top-1/2 right-0 border border-gray-300 rounded-lg opacity-80'
          style={{ transform: 'translateX(30%) translateY(-25%)' }}
        >
          <Image
            className='rounded-lg'
            src='/landingpage/drm/devrel/devrel-landingpage-image-1.png'
            alt='Right Float Image'
            width={853}
            height={512}
          />
        </div>
        <div className='absolute top-1/2 right-0 rounded-lg' style={{ transform: 'translateX(30%) translateY(-25%)' }}>
          <Image
            className='rounded-lg'
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
