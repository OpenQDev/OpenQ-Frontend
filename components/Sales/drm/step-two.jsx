import React from 'react';
import StepTwoContent from './elements/step-two-content';

const StepOne = () => {
  return (
    <div>
      <div className='flex flex-row space-x-44 justify-center bg-white text-left items-center pt-44'>
        <StepTwoContent />
        <div className=''>
          <div className='text-black text-4xl font-extrabold pt-3 w-[35rem]'>
            Automating GitHub data retrieval, transforming manual processes into automated tasks
          </div>
          <div className='text-gray-800 text-lg pt-5 w-[35rem]'>
            Our strategies are aiding you to compare projects - manage your time effectively and pinpoint which projects
            need immediate attention.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
