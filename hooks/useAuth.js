import { useEffect, useContext } from 'react';
import AuthContext from '../store/AuthStore/AuthContext';
import StoreContext from '../store/Store/StoreContext';
import axios from 'axios';

const useAuth = () => {
	const [authState, setAuthState] = useContext(AuthContext);
	const [appState,] = useContext(StoreContext);

	useEffect(() => {
		async function checkAuth() {
			axios.get(`${appState.authBaseUrl}/checkAuth`, { withCredentials: true })
				.then((res) => {
					setAuthState({ type: 'UPDATE_IS_AUTHENTICATED', payload: res.data.isAuthenticated });
				})
				.catch((error) => {
					console.error(error);
				});
		}
		checkAuth();
	}, []);

	return [authState, setAuthState];
};

export default useAuth;