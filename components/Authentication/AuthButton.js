// Third party
import React, { useContext } from 'react';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import SignOut from './SignOut';
import GithubSignIn from './GithubSignIn';

const AuthButton = ({ redirectUrl, propicUrl, className, hideSignOut, signInStyle }) => {
  const [authState] = useContext(AuthContext);
  return (
    <div className={`w-full justify-center ${className}`}>
      {authState.githubId ? (
        !hideSignOut ? (
          <SignOut propicUrl={propicUrl} styles={'justify-center'} />
        ) : null
      ) : (
        <GithubSignIn redirectUrl={redirectUrl} signInStyle={signInStyle} />
      )}
    </div>
  );
};

export default AuthButton;
