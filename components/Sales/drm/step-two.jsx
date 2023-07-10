import React from 'react';
import Image from 'next/image';

const StepTwo = () => {
  return (
    <div>
      <div className='flex flex-row bg-white text-left items-center pt-44'>
        <div className='relative pr-44 w-full'>
          <Image
            className='top-0 right-0 w-full h-full object-cover'
            src='/landingpage/drm/devrel/devrel-landingpage-image-4-2.png'
            alt='Centered Image'
            width={879}
            height={693}
          />
        </div>
        <div className='pr-52'>
          <div className='text-black text-4xl font-extrabold pt-3 w-[44rem]'>
            Summarize activies from hundreds of projects and quickly grasp what they are working on
          </div>
          <div className='text-gray-800 text-lg pt-5 w-[35rem]'>
            What they are doing with it and when they are about to leave. lorem ipsum{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
