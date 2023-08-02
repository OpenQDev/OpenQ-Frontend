import React from 'react';
import StepOneContent from './elements/step-one-content';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const StepOne = () => {
  return (
    <div>
      <div className='flex px-8 lg:px-28 lg:flex-row flex-col justify-between gap-4 bg-white lg:text-center items-center w-full '>
        <div className=' pb-8 md:pb-0'>
          <Heading className=' lg:text-left  pt-3 max-w-[35rem]'>🎯 OpenQ works where your developers work</Heading>
          <Paragraph className='pt-5 lg:text-left max-w-[35rem]'>
            We scrape thousands of repositories to discover projects utilizing your technology
          </Paragraph>
        </div>
        {/*  <div className=''>
          <Image
            className='top-0 left-0 w-full h-full object-cover'
            src='/landingpage/drm/devrel/devrel-landingpage-image-5.png'
            alt='Centered Image'
            width={879}
            height={693}
          />
        </div> */}
        <StepOneContent />
      </div>
    </div>
  );
};

export default StepOne;
