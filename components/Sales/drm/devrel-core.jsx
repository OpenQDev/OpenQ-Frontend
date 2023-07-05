import React from 'react';
import Image from 'next/image';

const DevRelCore = () => {
  return (
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
  );
};

export default DevRelCore;
