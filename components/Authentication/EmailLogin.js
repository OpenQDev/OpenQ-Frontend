// Third party
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../lib/UserContext';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { MailIcon } from '@primer/octicons-react';
import axios from 'axios';

const EmailLogin = () => {
  const [user, setUser] = useContext(UserContext);
  const [magic, setMagic] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');

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
      .then((res) => {
        console.log('Sign out success. Cookies cleared.')
      })
      .catch((error) => {
        console.error(error);
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
      });

      if (res.status === 200) {
        // Set the UserContext to the now logged in user
        let userMetadata = await magic.user.getMetadata();
        console.log('userMetadata', userMetadata);
        await setUser(userMetadata);
        setDisabled(false);
      }
    } catch (error) {
      setDisabled(false);
      console.log(error);
    }
  }

  return (
    <>
      {!user ? (
        <div className='flex flex-col md:flex-row gap-4 md:items-center'>
          <div>Sign in with your email address: </div>
          <input
            className='input-field h-full w-52'
            placeholder='Enter your email'
            size='sm'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className='flex items-center whitespace-nowrap gap-3 btn-primary'
            disabled={disabled}
            onClick={handleLoginWithEmail}
          >
            <MailIcon size={20} />
            Sign In
          </button>
        </div>
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

export default EmailLogin;
