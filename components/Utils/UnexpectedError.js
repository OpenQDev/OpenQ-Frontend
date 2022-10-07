import React from 'react';
import Link from 'next/link';

const UnexpectedError = ({ error }) => {
  return (
    <div className='absolute inset-0 flex text-lg  justify-center content-center items-center sm:bg-overlay bg-dark-mode z-50'>
      <div className='w-full p-4 max-w-md rounded-sm bg-[#161B22] space-y-2'>
        <h1 className='text-3xl mb-4'>Oops, something wrong.</h1>
        <p>Sorry, something went wrong. {error ? error : 'There was an error fetching data for your page.'}</p>
        <p className='flex w-full justify-between'>
          <span className='underline'>
            <Link href={'/'}>Go home</Link>
          </span>
          {error?.includes('Github') && (
            <span className='underline'>
              <Link href={'https://www.githubstatus.com/'}>Check Github Status</Link>.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
export default UnexpectedError;
