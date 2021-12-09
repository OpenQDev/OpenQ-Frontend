// Third Party
import React, { useState, useContext } from 'react';
import TokenFundBox from './SearchTokens/TokenFundBox';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';
import LoadingIcon from '../LoadingIcon';

const FundModal = ({ setShowModal, bountyAddress }) => {
	// State
	const [token, setToken] = useState({
		'name': 'Mock Link',
		'address': '0x5FbDB2315678afecb367f032d93F642f64180aa3',
		'symbol': 'mLink',
		'decimals': 18,
		'chainId': 80001,
		'logoURI': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
	});
	const [volume, setVolume] = useState('');
	const { showErrorModal, setShowErrorModal, showSuccessModal, setShowSuccessModal, showConfirmationModal, setShowConfirmationModal } = useConfirmErrorSuccessModals();
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('');

	// Context
	const [appState] = useContext(StoreContext);
	const { library } = useWeb3();

	// Methods
	async function fundBounty() {
		setIsLoading(true);
		const volumeInWei = volume * (10 ** token.decimals);
		const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toString());

		let approveSucceeded = false;
		try {
			await appState.openQClient.approve(library, bountyAddress, token.address, bigNumberVolumeInWei);
			approveSucceeded = true;
		} catch (error) {
			setTransactionHash(JSON.stringify(error));
			setErrorMessage(JSON.stringify(error));
			setIsLoading(false);
			setShowErrorModal(true);
		}

		if (approveSucceeded) {
			try {
				const fundTxnReceipt = await appState.openQClient.fundBounty(library, bountyAddress, token.address, bigNumberVolumeInWei);
				setTransactionHash(fundTxnReceipt.transactionHash);
				setSuccessMessage('Money funded!');
				setShowSuccessModal(true);
				setIsLoading(false);
			} catch (error) {
				setTransactionHash(JSON.stringify(error));
				setErrorMessage(JSON.stringify(error));
				setIsLoading(false);
				setShowErrorModal(true);
			}
		}
	}

	const updateModal = () => {
		setShowModal(false);
	};

	function onCurrencySelect(token) {
		console.log(token);
		setToken(token);
		setConfirmationMessage(`You are about to fund this bounty at address ${bountyAddress} with ${volume} ${token.name}. Is this correct?`);
	}

	function onVolumeChange(volume) {
		console.log(volume);
		setVolume(volume);
		setConfirmationMessage(`You are about to fund this bounty at address ${bountyAddress} with ${volume} ${token.name}. Is this correct?`);
	}

	// Render
	return (
		<div>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-auto my-6 mx-auto max-w-3xl">
					<div className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
						<div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
							<h3 className="text-3xl font-semibold">Fund</h3>
						</div>
						<div className=" p-6 flex-auto">
							<TokenFundBox onCurrencySelect={onCurrencySelect} onVolumeChange={onVolumeChange} token={token} volume={volume} />
						</div>
						<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
							<button
								className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => setShowConfirmationModal(true)}
							>
								Fund
							</button>
						</div>
						<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
							<button
								className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => updateModal()}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
			{isLoading && <LoadingIcon />}
			<ConfirmErrorSuccessModalsTrio
				setShowErrorModal={setShowErrorModal}
				showErrorModal={showErrorModal}
				errorMessage={errorMessage}

				setShowConfirmationModal={setShowConfirmationModal}
				showConfirmationModal={showConfirmationModal}
				confirmationTitle={'Fund Bounty'}
				confirmationMessage={confirmationMessage}
				positiveOption={'Yes, Refund!'}
				confirmMethod={fundBounty}

				showSuccessModal={showSuccessModal}
				setShowSuccessModal={setShowSuccessModal}
				successMessage={successMessage}
				transactionHash={transactionHash}
			/>
		</div>
	);
};


export default FundModal;
