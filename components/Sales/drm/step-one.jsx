import React from 'react';
import StepOneContent from './elements/step-one-content';

const StepOne = () => {
  return (
    <div>
      <div className='flex px-8 lg:flex-row flex-col xl:gap-x-44 gap-24 justify-center bg-white text-center md:text-left items-center '>
        <div className=' pb-8 md:pb-0'>
          <div className='text-black text-center lg:text-left lg:text-5xl  text-4xlfont-extrabold pt-3 max-w-[35rem]'>
            Add GitHub repositories, organizations and users using your technology
          </div>
          <div className='text-gray-800 text=lg lg:text-xl pt-5 text-center lg:text-left max-w-[35rem]'>
            Even in the absence of pre-existing data, our target scout can scrape millions of repositories to discover
            projects utilizing your technology
          </div>
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
