// Third Party Libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Custom
import useAuth from '../../hooks/useAuth';
import LoadingIcon from '../Loading/LoadingIcon';
import AuthButton from '../Authentication/AuthButton';
import useWeb3 from '../../hooks/useWeb3';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';

const ClaimPage = () => {
	// State
	const [issueUrl, setIssueUrl] = useState('');
	const {
		showErrorModal,
		setShowErrorModal,
		showSuccessModal,
		setShowSuccessModal,
		showConfirmationModal,
		setShowConfirmationModal,
	} = useConfirmErrorSuccessModals();
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [confirmationMessage, setConfirmationMessage] = useState('');

	// Context
	const { account } = useWeb3();

	// Hooks
	const [authState] = useAuth();

	useEffect(() => {
		if (issueUrl) {
			setConfirmationMessage(
				`You are about to claim the deposits on issue ${issueUrl} to the address ${account}. Is this correct ?`
			);
			console.log(confirmationMessage);
		}
	}, [issueUrl]);

	// Methods
	const claimBounty = async () => {
		setIsLoading(true);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
				{
					issueUrl,
					payoutAddress: account,
				},
				{ withCredentials: true }
			)
			.then((result) => {
				const { payoutAddress, transactionHash, issueUrl } = result.data;
				setIsLoading(false);
				setTransactionHash(transactionHash);
				setSuccessMessage(
					`Successfully transferred assets on issue with at ${issueUrl} to ${payoutAddress}!`
				);
				setShowSuccessModal(true);
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error.response);
				console.log(error.response.data.message);
				setErrorMessage(error.response.data.message);
				setShowErrorModal(true);
			});
	};
	return (
		<div className="flex flex-1 font-mont justify-center items-center">
			<div className="w-5/6 pt-16 pb-24">
				<div className="text-3xl font-semibold text-white text-center pb-5">
					Claim Bounty
				</div>
				<div className="grid grid-cols-3 gap-5">
					{!authState.isAuthenticated ? (
						<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
							We noticed you are not signed into Github. You must sign to verify
							and claim an issue!
						</div>
					) : (
						<div className="bg-green-300 col-span-3 bg-opacity-20 border border-green-500 rounded-lg text-white p-4">
							Successfully signed in, you can claim your issue now.
						</div>
					)}

					<div className="col-span-3 flex gap-3">
						<div className="flex items-center p-2 flex-1 rounded-lg py-1 text-base bg-dark-mode border border-web-gray shadow-inner text-white">
							<input
								className="pl-3 bg-dark-mode box-content w-2/3 outline-none"
								id="name"
								placeholder="Issue URL"
								type="text"
								value={issueUrl}
								onChange={(event) => setIssueUrl(event.target.value)}
							/>
						</div>
						<button
							type="submit"
							className="confirm-btn w-1/3"
							onClick={() => setShowConfirmationModal(true)}
						>
							Claim
						</button>
					</div>
					<AuthButton
						redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/claim`}
					/>
					{isLoading && <LoadingIcon />}
				</div>
			</div>
			<ConfirmErrorSuccessModalsTrio
				setShowErrorModal={setShowErrorModal}
				showErrorModal={showErrorModal}
				errorMessage={errorMessage}
				setShowConfirmationModal={setShowConfirmationModal}
				showConfirmationModal={showConfirmationModal}
				confirmationTitle={'Confirm Claim'}
				confirmationMessage={confirmationMessage}
				confirmMethod={claimBounty}
				positiveOption={'Yes, Claim!'}
				transactionHash={transactionHash}
				showSuccessModal={showSuccessModal}
				setShowSuccessModal={setShowSuccessModal}
				message={successMessage}
			/>
		</div>
	);
};

export default ClaimPage;
