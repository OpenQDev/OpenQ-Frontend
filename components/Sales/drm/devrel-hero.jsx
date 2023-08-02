import React from 'react';
import UpperAnim from '../../animations/UpperAnim';
import LeftAnim from '../../animations/LeftAnim';
import RightAnim from '../../animations/RightAnim';
import MobileAnim from '../../animations/MobileAnim';
import Heading from './base/heading';

const DevRelHero = () => {
  return (
    <div className=' pt-16 lg:-mb-44'>
      <div className='2xl:flex relative hidden justify-center pt-12 2xl:mr-[24rem] overflow-hidden'>
        <UpperAnim />
      </div>
      <div className='grid 2xl:grid-cols-[30%_40%_30%] justify-center justify-items-center w-full '>
        <div className='hidden 2xl:block flex-1 relative top-[84px] left-8'>
          <LeftAnim />
        </div>
        <div className='flex flex-col justify-content-center items-center '>
          <div className='flex flex-col justify-center items-center lg:text-center px-8'>
            <div className='text-gray-400 text-sm font-normal'>Developer Relationship Management Platform</div>
            <Heading className='2xl:text-[48px]  pt-3 2xl:w-[50rem]'>Supercharge developer relations</Heading>
            <div className='text-gray-800 text-2xl 2xl:text-2xl pt-5 2xl:w-[48rem]'>
              We give your DevRel team direct access to every beat in the pulse of your developer ecosystem
            </div>
          </div>
        </div>
        <div className='flex-1'></div>
      </div>
      <div className='2xl:flex hidden justify-center 2xl:ml-[48rem] relative 2xl:-top-[100px] overflow-hidden'>
        <RightAnim />
      </div>
      <div className='2xl:hidden w-full flex justify-center  '>
        <MobileAnim />
      </div>
    </div>
  );
};

export default DevRelHero;
