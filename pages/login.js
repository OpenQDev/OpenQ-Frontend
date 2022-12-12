import React from 'react';
import Image from 'next/image';
import GithubSignIn from '../components/Authentication/LoginPageGithubSignIn';
import EmailLogin from '../components/Authentication/LoginPageEmailLogin';

const Login = () => {
  return (
    <div className='flex fixed inset-0 justify-between items-center h-screen bg-dark-mode z-10'>
      <div className='text-2xl xl:w-1/2 xl:block hidden object-fill'>
        <Image src='/SpaceScapes/login.png' width={1000} height={200} />
      </div>
      <div className='text-xl w-full xl:w-1/2 text-center flex  gap-4 justify-center items-center   justify-items-center content-center'>
        <div className='w-96 space-y-4'>
          <h1 className='my-2 text-2xl'>Let's get you started!</h1>
          <EmailLogin />
          <div className='text-muted'>or</div>

          <GithubSignIn redirectUrl={'/'} />
        </div>{' '}
      </div>
    </div>
  );
};

export default Login;
