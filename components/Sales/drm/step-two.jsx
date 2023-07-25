import React from 'react';
import StepTwoContent from './elements/step-two-content';

const StepTwo = () => {
  return (
    <div>
      <div className='flex lg:flex-row flex-col px-4 gap-16 xl:gap-x-44 justify-center bg-white text-left items-center pt-44'>
        <div className=''>
          <div className='text-black text-4xl font-extrabold pt-3 max-w-[35rem]'>
            Automating GitHub data retrieval, transforming manual processes into automated tasks
          </div>
          <div className='text-gray-800 text-lg pt-5 max-w-[35rem]'>
            Our strategies are aiding you to compare projects - manage your time effectively and pinpoint which projects
            need immediate attention.
          </div>
        </div>
        <StepTwoContent />
      </div>
    </div>
  );
};

export default StepTwo;
