// Third party
import React, { useEffect, useContext } from 'react';
import { UserContext } from '../../lib/UserContext';
import { useRouter } from 'next/router';

import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

function EmailAuth() {
  const [, setUser] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    finishEmailRedirectLogin();
  }, []);

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()],
    });

    const re = new RegExp('[?]([^=]+)=(.*)');
    const arr = re.exec(router.asPath);
    let magicCredential = arr[2];
    if (magicCredential) magic.auth.loginWithCredential().then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken) => {
    console.log('didToken', didToken);
    let res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken,
      },
    });

    console.log('res', res);
    console.log('res.status', res.status);

    if (res.status === 200) {
      let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
        extensions: [new OAuthExtension()],
      });
      // Set the UserContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      await setUser(userMetadata);
      router.push(process.env.NEXT_PUBLIC_BASE_URL);
    }
  };

  return (
    <div className='flex fixed inset-0 justify-center'>
      <div className=' h-min text-center self-center flex flex-col items-center gap-4 px-4'>
        <p>Authenticating with your email</p>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='animate-spin'
          viewBox='0 0 512 512'
          height='20'
          width='20'
          fill='#ffffff'
        >
          <path d='M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z' />
        </svg>
      </div>
    </div>
  );
}

export default EmailAuth;
