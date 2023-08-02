import React from 'react';
import StepTwoContent from './elements/step-two-content';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const StepTwo = () => {
  return (
    <div>
      <div className='flex lg:flex-row flex-col  gap-8 md:justify-between bg-white items-center lg:text-left px-8 md:px-28  '>
        <div className='lg:order-2'>
          <Heading className='max-w-[35rem]'>⚙️ Go from manual to automated GitHub operations</Heading>
          <Paragraph className=' pt-8 max-w-[35rem]'>
            The OpenQ DRM lets you compare project activity, manage your time effectively, and pinpoint which projects
            need immediate attention.
          </Paragraph>
        </div>
        <StepTwoContent />
      </div>
    </div>
  );
};

export default StepTwo;
