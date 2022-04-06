// Third Party
import React, { useContext } from 'react';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import SignOut from './SignOut';
import SignIn from './SignIn';

const AuthButton = ({ redirectUrl, propicUrl, styles }) => {
	const [authState,] = useContext(AuthContext);

	return (
		<>
			{authState.isAuthenticated ? <SignOut propicUrl={propicUrl} styles={styles} /> : <SignIn redirectUrl={redirectUrl} styles={styles} />}
		</>
	);
};

export default AuthButton;
