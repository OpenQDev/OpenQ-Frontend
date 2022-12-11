import React from 'react';
import GithubSignIn from '../components/Authentication/GithubSignIn';
import EmailLogin from '../components/Authentication/EmailLogin';

const Login = () => {
  return (
    <div className='flex fixed inset-0 justify-center items-center h-screen mt-16'>
      <div className='text-2xl'>
        <GithubSignIn redirectUrl={'/'} signInStyle={'btn-primary'} />
        <br />
        <div className='or text-center'>- OR -</div>
        <br />
        <EmailLogin />
      </div>
    </div>
  );
};

export default Login;
