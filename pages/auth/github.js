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
				// Retrieve csrf_nonce from local storage
				const nonce = window.localStorage.getItem('csrf_nonce');

				// Retrieve state param from URL
				const params = new URLSearchParams(window.location.search);
				const state = params.get('state');

				// JSON Parse state and lookup with csrf_token
				let parsedState = JSON.parse(state);
				let redirectObject = parsedState[nonce];

				if (redirectObject) {
					// If the nonce is present in the parsed state, that is good
					let redirectUrl = redirectObject.redirectUrl;
					router.push(redirectUrl);
				} else {
					// If not, you may be under a CSRF attack
					alert('CSRF Alert!');
				}
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
