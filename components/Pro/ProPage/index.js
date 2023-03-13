import React from 'react';
import CreateAccount from './CreateAccount';

const ProPage = () => {
  return (
    <div className=' grid grid-cols-3 justify-center'>
      <h1 className='text-2xl my-8 col-span-3'>
        Create a (free) pro account with us to sign up for are premium services.
      </h1>
      <CreateAccount />
      <div></div>
      <div></div>
    </div>
  );
};
export default ProPage;
