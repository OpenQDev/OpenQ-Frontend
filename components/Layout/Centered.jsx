import React from 'react';

const Centered = ({ children }) => {
  return (
    <div>
      <div className='lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center md:pr-3 pt-10'>
        <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Centered;
