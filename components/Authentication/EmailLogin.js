// Third party
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../lib/UserContext';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const EmailLogin = () => {
  const [user, setUser] = useContext(UserContext);
  const [magic, setMagic] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    let newMagic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()],
    });

    setMagic(newMagic);
  }, []);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser({ user: null });
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
        console.log(userMetadata);
        await setUser(userMetadata);
      }
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  return (
    <>
      <input placeholder='Enter your email' size='sm' value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={disabled} onClick={handleLoginWithEmail}>
        Sign In With Email
      </button>
      <button disabled={disabled} onClick={logout}>
        Logout
      </button>
      <div>{JSON.stringify(user)}</div>
    </>
  );
};

export default EmailLogin;
