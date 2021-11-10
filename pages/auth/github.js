// Third Party
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Custom
import StoreContext from '../../store/Store/StoreContext';

function GitHubAuth() {
	const [appState,] = useContext(StoreContext);
	const router = useRouter();
	const [, setAuthCode] = useState('NO AUTH CODE');

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
			Authenticating with GitHub...
		</div>
	);
}

export default GitHubAuth;
