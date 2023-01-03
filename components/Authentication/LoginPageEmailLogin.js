// Third party
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../lib/UserContext';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { ArrowRightIcon, MailIcon } from '@primer/octicons-react';
import axios from 'axios';
import StoreContext from '../../store/Store/StoreContext';
import { useRouter } from 'next/router';

const LoginPageEmailLogin = () => {
  const [user, setUser] = useContext(UserContext);
  const [magic, setMagic] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [appState, dispatch] = useContext(StoreContext);
  const { accountData } = appState;
  const router = useRouter();

  useEffect(() => {
    let newMagic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()],
    });

    setMagic(newMagic);
  }, []);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser(null);
      signOut();
    });
  };

  const signOut = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
        withCredentials: true,
      })
      .then(() => {
        dispatch({ payload: {}, type: 'UPDATE_ACCOUNTDATA' });
        appState.logger.info({ message: 'Sign out success. Cookies cleared.' }, accountData.id, 'loginPageEmailLogin1');
      })
      .catch((error) => {
        appState.logger.error({ message: error }, accountData.id, 'loginPageEmailLogin2');
      });
  };

  async function handleLoginWithEmail() {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/auth/email', window.location.origin).href, // optional redirect back to your app after magic link is clicked
      });

      // Validate didToken with server
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
        withCredentials: true,
        credentials: 'include',
      });
      if (res.status === 200) {
        // Set the UserContext to the now logged in user

        const { id, ...user } = await appState.openQPrismaClient.upsertUser({ email, username: email });

        const accountDispatch = {
          type: 'UPDATE_ACCOUNTDATA',
          payload: { ...user, id },
        };
        dispatch(accountDispatch);

        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`);
      }
    } catch (error) {
      setDisabled(false);
      appState.logger.error({ message: error }, accountData.id, 'loginPageEmailLogin3');
    }
  }

  return (
    <>
      {!user ? (
        <>
          <input
            className='rounded-full border border-web-gray bg-transparent h-full w-full p-2 px-4'
            placeholder='Enter your email'
            size='sm'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className='flex items-center whitespace-nowrap gap-3 rounded-full p-2 px-4 bg-white w-full text-black hover:bg-gray-200 justify-center font-bold cursor-pointer'
            disabled={disabled}
            onClick={handleLoginWithEmail}
          >
            <MailIcon size={20} />
            Continue with Email
            <ArrowRightIcon size={32} />
          </button>
        </>
      ) : (
        <div className='flex flex-col md:flex-row md:items-center gap-4 '>
          <div className='flex gap-2'>
            You are logged in as <div className='text-blue-500'>{user.email}</div>
          </div>
          <button
            className={`flex items-center whitespace-nowrap gap-3 btn-default ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={disabled}
            onClick={logout}
          >
            <MailIcon size={20} />
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default LoginPageEmailLogin;
