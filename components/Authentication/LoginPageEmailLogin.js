// Third party
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../lib/UserContext';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { ArrowRightIcon, MailIcon } from '@primer/octicons-react';
import axios from 'axios';
import StoreContext from '../../store/Store/StoreContext';
import { useRouter } from 'next/router';
import AuthContext from '../../store/AuthStore/AuthContext';
import ToolTipNew from '../Utils/ToolTipNew';

const LoginPageEmailLogin = () => {
  const [user, setUser] = useContext(UserContext);
  const [magic, setMagic] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [appState, appDispatch] = useContext(StoreContext);
  const [validEmail, setValidEmail] = useState(appState.accountData.email);
  const [, authDispatch] = useContext(AuthContext);
  const { accountData } = appState;
  const router = useRouter();

  useEffect(() => {
    let newMagic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()],
    });

    setMagic(newMagic);
  }, []);

  useEffect(() => {
    if (!validEmail) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [validEmail]);

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
        appDispatch({ payload: {}, type: 'UPDATE_ACCOUNTDATA' });
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
        const fullApiUser = await appState.openQPrismaClient.getUser({ email });
        const isNewUser = !fullApiUser;
        if (isNewUser) {
          const newUserDispatch = {
            type: 'IS_NEW_USER',
            payload: true,
          };
          authDispatch(newUserDispatch);
        }
        const { id, ...user } = await appState.openQPrismaClient.upsertUser({ email });
        authDispatch({
          type: 'UPDATE_IS_AUTHENTICATED',
          payload: { isAuthenticated: true, email: email },
        });
        const accountDispatch = {
          type: 'UPDATE_ACCOUNTDATA',
          payload: { ...user, id },
        };
        appDispatch(accountDispatch);

        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`);
      }
    } catch (error) {
      setDisabled(false);
      appState.logger.error({ message: error }, accountData.id, 'loginPageEmailLogin3');
    }
  }

  function handleChange(e) {
    setEmail(e.target.value);
    setValidEmail(appState.utils.emailRegex(e.target.value) && e.target.value);
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
            onChange={(e) => handleChange(e)}
          />
          <ToolTipNew
            hideToolTip={!disabled || validEmail}
            toolTipText={!validEmail && 'Please enter a valid email address to subscribe.'}
            triangleStyles={'md:mt-0.5'}
            relativePosition={'rounded-full p-4'}
            innerStyles={'text-lg'}
          >
            <button
              className={`flex items-center whitespace-nowrap gap-3 rounded-full p-2 px-4 bg-white w-full text-black hover:bg-gray-200 justify-center font-bold ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={disabled}
              onClick={handleLoginWithEmail}
            >
              <MailIcon size={20} />
              Continue with Email
              <ArrowRightIcon size={32} />
            </button>
          </ToolTipNew>
        </>
      ) : (
        <div className='flex flex-col md:flex-row md:items-center gap-4 '>
          <div className='flex gap-2'>
            You are logged in as <div className='text-link-colour'>{user.email}</div>
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
