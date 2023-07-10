import React from 'react';
import Image from 'next/image';

const StepThree = () => {
  return (
    <div>
      <div className='flex flex-row bg-white text-left items-center pt-44'>
        <div className='pl-52'>
          <div className='text-black text-4xl font-extrabold pt-3 w-[35rem]'>
            Not just analytics but also relationship management
          </div>
          <div className='text-gray-800 text-lg pt-5 w-[35rem]'>
            What they are doing with it and when they are about to leave. lorem ipsum
          </div>
        </div>
        <div className='relative pl-64 w-full'>
          <Image
            className='top-0 left-0 w-full h-full object-cover'
            src='/landingpage/drm/devrel/devrel-landingpage-image-5.png'
            alt='Centered Image'
            width={879}
            height={693}
          />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
