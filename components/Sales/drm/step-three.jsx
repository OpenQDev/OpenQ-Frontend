import React from 'react';
import Image from 'next/image';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const StepThree = () => {
  return (
    <div>
      <div className='flex flex-col px-16 md:px-28 md:justify-between lg:flex-row bg-white items-center 2xl:gap-10  lg:gap-16 gap-8'>
        <div className=''>
          <Heading className='max-w-[100rem]'>
            Centralize and streamline communications with essential projects in a unified interface
          </Heading>
          <Paragraph className='text-gray-800  text-lg lg:text-xl pt-5 max-w-[35rem]'>
            Using AI to immediately comprehend the activities undertaken by the project in the recent months and
            generate message templates that yield high response rates
          </Paragraph>
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
