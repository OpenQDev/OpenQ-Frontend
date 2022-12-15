// Third party
import React from 'react';
import { useRouter } from 'next/router';
// Custom
import Image from 'next/image';

const GithubSignIn = ({ redirectUrl, signInStyle }) => {
  const router = useRouter();

  const signIn = () => {
    const clientId = `client_id=${process.env.NEXT_PUBLIC_OPENQ_ID}`;
    const nonce = randomString(10);
    window.localStorage.setItem('csrf_nonce', nonce);
    const state = {
      [nonce]: {
        redirectUrl,
      },
    };
    const stateParams = `state=${JSON.stringify(state)}`;
    router.push(
      `https://github.com/login/oauth/authorize?${clientId}&${stateParams}&scope=read:user%20read:org%20public_repo`
    );
  };

  function randomString(length) {
    return Array(length + 1)
      .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
      .slice(0, length);
  }

  return (
    <button
      onClick={() => signIn()}
      className={`flex justify-center ${signInStyle ? signInStyle : 'btn-default'} whitespace-nowrap w-full`}
    >
      <div className='flex flex-row items-center justify-center space-x-3'>
        <div className='h-4 w-4 md:h-6 md:w-6 relative'>
          <Image src='/social-icons/github-logo-white.svg' alt='Picture of the author' width={24} height={24} />
        </div>
        <div>Sign In</div>
      </div>
    </button>
  );
};

export default GithubSignIn;
