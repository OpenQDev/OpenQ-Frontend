import React from 'react';
import Image from 'next/image';

const StepThree = () => {
  return (
    <div>
      <div className='flex flex-col px-4 md:px-16  lg:flex-row bg-white text-center lg:text-left items-center 2xl:gap-48  lg:gap-16 gap-8'>
        <div className='pl-12'>
          <div className='text-black lg:text-5xl text-4xl font-extrabold max-w-[120rem]'>
            Centralize and streamline communications with essential projects in a unified interface
          </div>
          <div className='text-gray-800  text-lg lg:text-xl pt-5 max-w-[35rem]'>
            Using AI to immediately comprehend the activities undertaken by the project in the recent months and
            generate message templates that yield high response rates
          </div>
        </div>
        <div className='relative w-full grow rounded-lg border border-gray-300 overflow-hidden'>
          <Image
            className='top-0 left-0 w-full h-full object-cover -m-1'
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
