// Third party
import React from 'react';
import Link from 'next/link';

const LogIn = () => {
  return (
    <Link href='/login'>
      <button className={`flex justify-center btn-default whitespace-nowrap w-full`}>
        <div className='flex flex-row items-center justify-center space-x-3'>
          <div>Log in</div>
        </div>
      </button>
    </Link>
  );
};

export default LogIn;
