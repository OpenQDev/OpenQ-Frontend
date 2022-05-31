import { useEffect, useContext } from 'react';
import AuthContext from '../store/AuthStore/AuthContext';
import axios from 'axios';

const useAuth = () => {
	const [authState, setAuthState] = useContext(AuthContext);

	useEffect(() => {
		async function checkAuth() {
			axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/checkAuth`, { withCredentials: true })
				.then((res) => {
					setAuthState({ type: 'UPDATE_IS_AUTHENTICATED', payload: { isAuthenticated: res.data.isAuthenticated, avatarUrl: res.data.avatarUrl } });
				})
				.catch((error) => {
					console.error(error);
				});
		}
		if(process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'local'){
			checkAuth();}
	}, []);

	return [authState, setAuthState];
};

export default useAuth;