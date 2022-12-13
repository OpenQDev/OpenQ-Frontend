import React from 'react';
import Image from 'next/image';
import LoginPageGithubSignIn from '../components/Authentication/LoginPageGithubSignIn';
import EmailLogin from '../components/Authentication/LoginPageEmailLogin';

const Login = () => {
  return (
    <div className='flex fixed inset-0 justify-between items-center h-screen bg-dark-mode z-10'>
      <div className='absolute top-2 md:inset-4 w-full content-center md:w-fit md:h-fit z-40'>
        <div className='flex justify-center'>
          <Image src='/openq-logo-with-text.png' width={150} height={150} />
        </div>
      </div>
      <div className='text-2xl absolute bottom-32 md:inset-0 xl:block  object-fill'>
        <Image src='/SpaceScapes/login.png' width={1000} height={200} />
      </div>
      <div className='text-xl w-full text-center flex gap-4 justify-center items-center justify-items-center content-center'>
        <div className=' md:w-1/2 space-y-4 mx-4'>
          <h1 className='my-2 text-3xl'>Let's get you started!</h1>
          <EmailLogin />
          <div className='text-muted'>or</div>
          <LoginPageGithubSignIn redirectUrl={'/'} />
          <div className='pt-8 text-muted text-sm'>
            By continuing, you acknowledge that you have read, understood and agree to our{' '}
            <a
              className='hover:underline text-blue-400'
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.openq.dev/terms-of-service'
            >
              terms of service
            </a>{' '}
            and{' '}
            <a
              className='hover:underline text-blue-400'
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.openq.dev/privacy'
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
