// Third party
import React, { useContext } from 'react';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import SignOut from './SignOut';
import SignIn from './SignIn';

const AuthButton = ({ redirectUrl, propicUrl, styles, hideSignOut }) => {
	const [authState,] = useContext(AuthContext);

	return (
		<>
			{authState.isAuthenticated ? !hideSignOut ? <SignOut propicUrl={propicUrl} styles={styles} /> : null : <SignIn redirectUrl={redirectUrl} styles={styles} />}
		</>
	);
};

export default AuthButton;
