import React from 'react';

const ProfileTabWrapper = ({ title, message, children }) => {
  return (
    <div className='flex px-8 w-full justify-between mt-12'>
      <section className='flex flex-col gap-3 w-full'>
        {' '}
        <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>{title}</h4>
        <div className='flex items-center gap-2'>{message} </div>
        {children}
      </section>
    </div>
  );
};
export default ProfileTabWrapper;
