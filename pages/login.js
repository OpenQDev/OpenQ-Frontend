import React from 'react';
import Image from 'next/image';
import LoginPageGithubSignIn from '../components/Authentication/LoginPageGithubSignIn';
import EmailLogin from '../components/Authentication/LoginPageEmailLogin';

const Login = () => {
  return (
    <div className='flex flex-col md:flex-row fixed inset-0 justify-end items-center h-screen z-10 bg-dark-mode'>
      <div className='absolute top-2 md:inset-4 w-full content-center md:w-fit md:h-fit z-10'>
        <div className='flex justify-center'>
          <Image src='/openq-logo-with-text.png' width={150} height={150} />
        </div>
      </div>
      <div className='text-2xl relative md:inset-0 w-full h-full'>
        <Image src='/SpaceScapes/login.png' className='object-fill h-full w-full' width={800} height={500} />
      </div>
      <div className='text-xl bottom-0 relative h-full md:w-[1900px] py-8 text-center bg-dark-mode flex gap-4 justify-center items-center'>
        <div className=' md:w-1/2 space-y-4 mx-4'>
          <h1 className='my-2 text-3xl'>Let's get you started!</h1>
          <EmailLogin />
          <LoginPageGithubSignIn redirectUrl={'/'} />
          <div className='pt-8 text-muted text-sm'>
            By continuing, you acknowledge that you have read, understood and agree to our{' '}
            <a className='hover:underline text-blue-400' target='_blank' rel='noopener noreferrer' href='/terms-of-use'>
              terms of service
            </a>{' '}
            and{' '}
            <a
              className='hover:underline text-blue-400'
              target='_blank'
              rel='noopener noreferrer'
              href='/privacy-policy'
            >
              privacy policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
