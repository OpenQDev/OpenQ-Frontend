import React from 'react';
import UpperAnim from '../../animations/UpperAnim';
import LeftAnim from '../../animations/LeftAnim';
import RightAnim from '../../animations/RightAnim';

const DevRelHero = () => {
  return (
    <div className='bg-white'>
      <div className='flex justify-center pt-12 mr-[24rem]'>
        <UpperAnim />
      </div>
      <div className='flex flex-row items-center justify-center -ml-[26rem]'>
        <div className=''>
          <LeftAnim />
        </div>
        <div className='flex flex-col justify-content-center items-center -ml-[7rem]'>
          <div className='flex flex-col justify-center items-center text-center '>
            <div className='text-gray-400 text-sm font-normal'>Developer Relationship Management Platform</div>
            <div className='text-black text-4xl font-extrabold pt-3 w-[40rem]'>
              Supercharge developer relations without manual work.
            </div>
            <div className='text-gray-800 text-lg pt-5 w-[32rem]'>
              OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and
              enhances interactions for efficient and informed collaborations. It's time to calculate and validate ROI.
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center ml-[30rem] -mt-6'>
        <RightAnim />
      </div>
    </div>
  );
};

export default DevRelHero;
