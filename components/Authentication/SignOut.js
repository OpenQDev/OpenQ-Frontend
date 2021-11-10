// Third Party
import React, { useContext } from 'react';
import axios from 'axios';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import StoreContext from '../../store/Store/StoreContext';

const SignOut = () => {
	const [, setAuthState] = useContext(AuthContext);
	const [appState,] = useContext(StoreContext);

	const signOut = () => {
		axios.get(`${appState.authBaseUrl}/logout`, { withCredentials: true })
			.then((res) => {
				setAuthState({ type: 'UPDATE_IS_AUTHENTICATED', payload: res.data.isAuthenticated });
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<button
			onClick={() => signOut()}
			className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
		>
			Sign Out
		</button>
	);
};

export default SignOut;
