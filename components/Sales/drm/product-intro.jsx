import React from 'react';

const ProductIntro = () => {
  return (
    <div>
      <div className='flex flex-col px-8  justify-center items-center text-center '>
        <div className='text-black text-4xl lg:text-5xl font-extrabold max-w-[80rem]'>
          What if you could make informed decisions with real-time, AI-driven insights into developers' activities?
        </div>
        <div className='text-gray-800 text-lg lg:text-xl pt-5 max-w-[44rem]'>
          OpenQ's DRM is more than a rudimentary CRM, offering a comprehensive suite for managing developer
          relationships. It unveils previously undiscoverable developer insights, adding depth to your decision-making
          arsenal.
        </div>
      </div>
    </div>
  );
};

export default ProductIntro;
