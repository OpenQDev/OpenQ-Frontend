import React from 'react';
import GrossValueMoved from '../components/Admin/GrossValueMoved';
import Blacklisting from '../components/Admin/Blacklisting';
import AuthorizedOnly from '../components/Admin/AuthorizedOnly';

const Admin = () => {
  return (
    <AuthorizedOnly>
      <div className='grid gap-8 justify-center content-center items-center grid-cols-[1fr_3fr] w-fit max-w-screen-lg min-h-[calc(100vh_-_246px)] text-xl font-semibold  text-muted'>
        <GrossValueMoved />
        <Blacklisting />
      </div>
    </AuthorizedOnly>
  );
};
export default Admin;
