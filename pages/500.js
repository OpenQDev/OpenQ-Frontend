import React from 'react';
import Link from 'next//link';

const InternalServerError = () => {
  return (
    <div
      className='flex fixed inset-0 justify-center items-center 
	 h-screen mt-16'
    >
      <div className='text-2xl'>
        500: Internal Server Error{' '}
        <span className='underline'>
          <Link href={'/'}>
            <span>Go home</span>
          </Link>
        </span>
        .
      </div>
    </div>
  );
};
export default InternalServerError;
