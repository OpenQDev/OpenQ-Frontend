import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import StoreContext from '../../store/Store/StoreContext';

function GitHubAuth() {
	const [appState,] = useContext(StoreContext);
	const router = useRouter();
	const [authCode, setAuthCode] = useState('NO AUTH CODE');
	const [token,] = useState('');

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setAuthCode(params.get('code'));
		exchangeAuthCodeForAccessToken(params.get('code'));
	}, []);

	const exchangeAuthCodeForAccessToken = (authCode) => {
		const url = `${appState.authBaseUrl}/?app=openq&code=${authCode}`;
		axios.get(url, { withCredentials: true })
			.then(() => {
				router.push(`${appState.baseUrl}/claim`);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			AuthCode is: {authCode}
			<br />
			Token is: {token}
		</div>
	);
}

export default GitHubAuth;
