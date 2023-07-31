import React from 'react';
import UpperAnim from '../../animations/UpperAnim';
import LeftAnim from '../../animations/LeftAnim';
import RightAnim from '../../animations/RightAnim';

const DevRelHero = () => {
  return (
    <div className=''>
      <div className='flex justify-center pt-12 lg:mr-[24rem] overflow-hidden'>
        <UpperAnim />
      </div>
      <div className='grid xl:grid-cols-[1fr_1fr_1fr] justify-center justify-items-center w-full '>
        <div className='hidden xl:block'>
          <LeftAnim />
        </div>
        <div className='flex flex-col justify-content-center items-center '>
          <div className='flex flex-col justify-center items-center text-center px-8'>
            <div className='text-gray-400 text-sm font-normal'>Developer Relationship Management Platform</div>
            <div className='text-black text-4xl lg:text-5xl font-extrabold pt-3 md:w-[50rem]'>
              Supercharge developer relations without manual work.
            </div>
            <div className='text-gray-800 text-lg lg:text-xl pt-5 md:w-[48rem]'>
              OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and
              enhances interactions for efficient and informed collaborations. It's time to calculate and validate ROI.
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center lg:ml-[30rem] lg:-mt-6 overflow-hidden'>
        <RightAnim />
      </div>
    </div>
  );
};

export default DevRelHero;
