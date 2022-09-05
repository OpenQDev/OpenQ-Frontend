// Third party
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import StoreContext from '../../store/Store/StoreContext.js';

function GitHubAuth() {
  const router = useRouter();
  const [, setAuthCode] = useState('NO AUTH CODE');

  const [appState] = useContext(StoreContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAuthCode(params.get('code'));
    exchangeAuthCodeForAccessToken(params.get('code'));
  }, []);

  const exchangeAuthCodeForAccessToken = (authCode) => {
    appState.authService
      .getAccessToken(authCode)
      .then(() => {
        // Retrieve csrf_nonce from local storage
        const nonce = window.localStorage.getItem('csrf_nonce');

        // Retrieve state param from URL
        const params = new URLSearchParams(window.location.search);
        const state = params.get('state');

        // JSON Parse state and lookup with csrf_token
        let parsedState = JSON.parse(state);
        let redirectObject = parsedState[nonce];

        if (redirectObject) {
          // If the nonce is present in the parsed state, that is good
          let redirectUrl = redirectObject.redirectUrl;
          router.push(redirectUrl);
        } else {
          // If not, you may be under a CSRF attack
          alert('CSRF Alert!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='flex fixed inset-0 justify-center'>
      <div className=' h-min text-center self-center flex flex-col items-center gap-4 px-4'>
        <p>Authenticating with GitHub. You will be redirected to OpenQ once we{"'"}re done.</p>
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

export default GitHubAuth;
