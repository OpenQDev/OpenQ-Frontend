import React from 'react';
import Heading from './base/heading';
import Paragraph from './base/paragraph';
import StepThreeContent from './step-three-content';

const StepThree = () => {
  return (
    <div>
      <div className='flex flex-col px-8 md:px-28 md:justify-between lg:flex-row bg-white items-center 2xl:gap-10  lg:gap-16 gap-8'>
        <div className=''>
          <Heading className='max-w-[100rem]'>All Your DevRel comms under one roof</Heading>
          <Paragraph className='text-gray-800  text-lg lg:text-xl pt-5 max-w-[35rem]'>
            From email to Telegram to Slack - OpenQ’s messaging integrations puts an end to your “too many tabs”
            syndrome
          </Paragraph>
        </div>
        <div className='relative w-full p-4 pt-2 grow max-w-[800px] rounded-sm lg:rounded-lg border border-gray-300 overflow-hidden'>
          <StepThreeContent />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
