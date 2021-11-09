import React, { useState, useContext } from 'react';
import axios from 'axios';
import StoreContext from '../store/Store/StoreContext';
import useAuth from '../hooks/useAuth';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import ErrorModal from '../components/ErrorModal';
import LoadingIcon from '../components/LoadingIcon';
import AuthButton from '../components/Authentication/AuthButton';

function Claim() {
	// State
	const [issueUrl, setIssueUrl] = useState('');

	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Context
	const [appState,] = useContext(StoreContext);
	const { account, library } = useWeb3React();

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
				const filter = {
					address: process.env.NEXT_PUBLIC_OPENQ_ADDRESS,
					topics: [
						// the name of the event, parnetheses containing the data type of each event, no spaces
						ethers.utils.id('IssueClosed(string,address,address)')
					]
				};

				library.on(filter, (event) => {
					let abi = [
						'event IssueClosed(string id, address indexed issueAddress, address indexed payoutAddress)'
					];

					let iface = new ethers.utils.Interface(abi);
					const { data, topics } = event;
					const logs = iface.parseLog({ data, topics });
					console.log(logs);
					console.log(event);
					if (logs.args.payoutAddress == account) {
						console.log('successful transfer!');
						setIsLoading(false);
					}
				});
			})
			.catch((error) => {
				setIsLoading(false);
				setErrorMessage(error.response.data.message);
				setShowErrorModal(true);
			});
	};

	// Render
	return (
		<div>
			<div className="flex font-mont pt-7 justify-center items-center">
				<div className="">
					<div className="flex flex-col">
						<div className="font-mont bg-gray-100 font-normal text-gray-600">
							{!authState.isAuthenticated && <div>We noticed you are not signed into Github. You must sign in to claim an issue!</div>}
							<form onSubmit={(event) => claimBounty(event)}>
								<input
									className="bg-gray-100 w-6/7 border-gray-100 outline-none"
									id="name"
									placeholder="https://github.com/OpenQDev/OpenQ-Frontend/issues/3"
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
								<AuthButton />
							</form>
							{isLoading && <LoadingIcon />}
							{showErrorModal && <ErrorModal modalVisibility={setShowErrorModal} message={errorMessage} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Claim;
