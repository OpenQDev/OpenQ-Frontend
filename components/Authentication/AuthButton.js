// Third Party
import React, { useContext } from 'react';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import SignOut from './SignOut';
import SignIn from './SignIn';

const AuthButton = () => {
	const [authState,] = useContext(AuthContext);

	return (
		<>
			{authState.isAuthenticated ? <SignOut /> : <SignIn />}
		</>
	);
};

export default AuthButton;
