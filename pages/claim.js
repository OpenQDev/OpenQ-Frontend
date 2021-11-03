import React, { useState, useContext } from 'react';
import axios from 'axios';
import StoreContext from '../store/Store/StoreContext';
import useAuth from '../hooks/useAuth';
import { useWeb3React } from '@web3-react/core';
import ErrorModal from '../components/ErrorModal';
import LoadingIcon from '../components/LoadingIcon';
import AuthButton from '../components/Authentication/AuthButton';

function Claim() {
	// State
	const [issueUrl, setIssueUrl] = useState('https://github.com/OpenQDev/OpenQ-Contracts/issues/48');

	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Context
	const [appState,] = useContext(StoreContext);
	const { account } = useWeb3React();

	// Hooks
	const [authState,] = useAuth();

	// Methods
	const claimBounty = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		axios.post(`${appState.oracleBaseUrl}/claim`, {
			issueUrl,
			payoutAddress: account
		}, { withCredentials: true })
			.then(() => {
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(false);
				setErrorMessage(error.response.data.message);
				setShowErrorModal(true);
			});
	};

	// Render
	return (
		<div className="font-mont bg-gray-100 font-normal text-gray-600">
			{!authState.isAuthenticated && <div>We noticed you are not signed into Github. You must sign in to claim an issue!</div>}
			<AuthButton />
			<form onSubmit={(event) => claimBounty(event)}>
				<input
					className="bg-gray-100 w-6/7 border-gray-100 outline-none"
					id="name"
					placeholder="https://github.com/OpenQDev/frontend/issues/3"
					type="text"
					value={issueUrl}
					onChange={(event) => setIssueUrl(event.target.value)}
				/>
				<button
					type="submit"
					className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
				>
					Claim
				</button>
			</form>
			{isLoading && <LoadingIcon />}
			{showErrorModal && <ErrorModal modalVisibility={setShowErrorModal} message={errorMessage} />}
		</div>
	);
}

export default Claim;
