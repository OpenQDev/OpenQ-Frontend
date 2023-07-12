import React from 'react';
import StepOneContent from './elements/step-one-content';

const StepOne = () => {
  return (
    <div>
      <div className='flex flex-row space-x-44 justify-center bg-white text-left items-center pt-44'>
        <div className='text-left'>
          <div className='text-black text-4xl font-extrabold pt-3 w-[35rem]'>
            Add GitHub repositories, organizations and users using your technology
          </div>
          <div className='text-gray-800 text-lg pt-5 w-[35rem]'>
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
