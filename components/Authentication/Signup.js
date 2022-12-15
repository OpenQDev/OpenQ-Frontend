// Third party
import React from 'react';
import Link from 'next/link';

const Signup = () => {
  return (
    <Link href='/login'>
      <button className={`flex justify-center btn-default whitespace-nowrap w-full`}>
        <div className='flex flex-row items-center justify-center space-x-3'>
          <div>Sign up</div>
        </div>
      </button>
    </Link>
  );
};

export default Signup;
