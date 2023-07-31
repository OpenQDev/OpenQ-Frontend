import React from 'react';
import Heading from './base/heading';
import Paragraph from './base/paragraph';

const ProductIntro = () => {
  return (
    <div>
      <div className='flex flex-col px-8  justify-center items-center text-center '>
        <Heading className='max-w-[80rem]'>
          What if you could make informed decisions with real-time, AI-driven insights into developers' activities?
        </Heading>
        <Paragraph className='text-gray-800 text-lg lg:text-xl pt-5 max-w-[44rem]'>
          OpenQ's DRM is more than a rudimentary CRM, offering a comprehensive suite for managing developer
          relationships. It unveils previously undiscoverable developer insights, adding depth to your decision-making
          arsenal.
        </Paragraph>
      </div>
    </div>
  );
};

export default ProductIntro;
