import React from 'react';
import UpperAnim from '../../animations/UpperAnim';
import LeftAnim from '../../animations/LeftAnim';
import RightAnim from '../../animations/RightAnim';
import MobileAnim from '../../animations/MobileAnim';
import Heading from './base/heading';

const DevRelHero = () => {
  return (
    <div className=''>
      <div className='xl:flex relative hidden justify-center pt-12 lg:mr-[24rem] overflow-hidden'>
        <UpperAnim />
      </div>
      <div className='grid xl:grid-cols-[30%_40%_30%] justify-center justify-items-center w-full '>
        <div className='hidden xl:block flex-1'>
          <LeftAnim />
        </div>
        <div className='flex flex-col justify-content-center items-center '>
          <div className='flex flex-col justify-center items-center text-center px-8'>
            <div className='text-gray-400 text-sm font-normal'>Developer Relationship Management Platform</div>
            <Heading className='lg:text-[48px]  pt-3 md:w-[50rem]'>
              Supercharge developer relations without manual work.
            </Heading>
            <div className='text-gray-800 text-lg lg:text-xl pt-5 md:w-[48rem]'>
              OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and
              enhances interactions for efficient and informed collaborations. It's time to calculate and validate ROI.
            </div>
          </div>
        </div>
        <div className='flex-1'></div>
      </div>
      <div className='xl:flex hidden justify-center lg:ml-[30rem] lg:-mt-6 overflow-hidden'>
        <RightAnim />
      </div>
      <div className='xl:hidden  w-full '>
        <MobileAnim />
      </div>
    </div>
  );
};

export default DevRelHero;
