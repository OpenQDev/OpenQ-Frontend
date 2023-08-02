import React from 'react';
import StepTwoContent from './elements/step-two-content';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const StepTwo = () => {
  return (
    <div>
      <div className='flex lg:flex-row flex-col  gap-8 md:justify-between bg-white items-center text-center px-8 md:px-28 lg:text-left '>
        <div className='lg:order-2'>
          <Heading className='max-w-[35rem]'>
            Automating GitHub data retrieval, transforming manual processes into automated tasks
          </Heading>
          <Paragraph className=' pt-8 max-w-[35rem]'>
            Our strategies are aiding you to compare projects, manage your time effectively, and pinpoint which projects
            need immediate attention.
          </Paragraph>
        </div>
        <StepTwoContent />
      </div>
    </div>
  );
};

export default StepTwo;
