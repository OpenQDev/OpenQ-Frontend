import React from 'react';
import UpperAnim from '../../animations/UpperAnim';

const DevRelHero = () => {
  return (
    <div className='flex flex-col justify-content-center items-center bg-white'>
      <div className='pt-16 pr-96'>
        <UpperAnim />
      </div>
      <div className='flex flex-col justify-center items-center text-center'>
        <div className='text-gray-400 text-sm font-normal'>Developer Relationship Management Platform</div>
        <div className='text-black text-4xl font-extrabold pt-3 w-[40rem]'>
          Supercharge developer relations without manual work.
        </div>
        <div className='text-gray-800 pt-5 w-[29rem]'>
          OpenQ's DRM Platform offers real-time insights into developer activities, tracks project relevance, and
          enhances interactions for efficient and informed collaborations. It's time to calculate and validate ROI.
        </div>
      </div>
    </div>
  );
};

export default DevRelHero;
