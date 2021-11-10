import React, { useState, useContext } from 'react';
import axios from 'axios';
import StoreContext from '../store/Store/StoreContext';
import useAuth from '../hooks/useAuth';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import LoadingIcon from '../components/LoadingIcon';
import AuthButton from '../components/Authentication/AuthButton';
import ConfirmClaimModal from '../components/ConfirmClaimModal';

function Claim() {
	// State
	const [issueUrl, setIssueUrl] = useState('');

	const [showErrorModal, setShowErrorModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);

	// Context
	const [appState,] = useContext(StoreContext);
	const { account, library } = useWeb3React();

	// Hooks
	const [authState,] = useAuth();

	// Methods
	const claimBounty = async () => {
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
					console.log(event);
					let abi = [
						'event IssueClosed(string id, address indexed issueAddress, address indexed payoutAddress)'
					];

					let iface = new ethers.utils.Interface(abi);
					const { data, topics } = event;
					let logs;

					try {
						logs = iface.parseLog({ data, topics });
						console.log(logs);
						if (logs.args.payoutAddress == account) {
							setIsLoading(false);
							setTransactionHash(event.transactionHash);
							setSuccessMessage(`Successfully transferred assets on issue at ${logs.args.issueAddress} to ${logs.args.payoutAddress}!`);
							setShowSuccessModal(true);
						}
					} catch (error) {
						setIsLoading(false);
						setErrorMessage(JSON.stringify(error));
						setShowErrorModal(true);
						console.log(error);
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
								onClick={() => setShowConfirmationModal(true)}
							>
								Claim
							</button>
							<AuthButton />
							{isLoading && <LoadingIcon />}
							{showErrorModal && <ErrorModal modalVisibility={setShowErrorModal} message={errorMessage} />}
							{showConfirmationModal && <ConfirmClaimModal modalVisibility={setShowConfirmationModal} address={account} claimBounty={claimBounty} issueUrl={issueUrl} />}
							{showSuccessModal && <SuccessModal modalVisibility={setShowSuccessModal} message={successMessage} transactionHash={transactionHash} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Claim;
