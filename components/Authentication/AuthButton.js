// Third party
import React, { useContext } from 'react';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import SignOut from './SignOut';
import SignIn from './SignIn';

const AuthButton = ({ redirectUrl, propicUrl, className, hideSignOut }) => {
  const [authState] = useContext(AuthContext);
  return (
    <div className={`w-full justify-center ${className}`}>
      {authState.isAuthenticated ? (
        !hideSignOut ? (
          <SignOut propicUrl={propicUrl} />
        ) : null
      ) : (
        <SignIn redirectUrl={redirectUrl} />
      )}
    </div>
  );
};

export default AuthButton;
