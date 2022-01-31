// Third Party Libraries
import React, { useState } from 'react';
import axios from 'axios';

// Custom
import useAuth from '../../hooks/useAuth';
import LoadingIcon from '../Loading/LoadingIcon';
import AuthButton from '../Authentication/AuthButton';
import useWeb3 from '../../hooks/useWeb3';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';

const ClaimPage = ({ bounty }) => {
	const { url } = bounty;
	// State
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

	// Context
	const { account } = useWeb3();
	const confirmationMessage = `You are about to claim the deposits on issue ${url} to the address ${account}. Is this correct ?`;
	// Hooks
	const [authState] = useAuth();

	// Methods
	const claimBounty = async () => {
		setIsLoading(true);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
				{
					issueUrl: url,
					payoutAddress: account,
				},
				{ withCredentials: true }
			)
			.then((result) => {
				const { payoutAddress, transactionHash } = result.data;
				setIsLoading(false);
				setTransactionHash(transactionHash);
				setSuccessMessage(
					`Successfully transferred bounties on issue at ${url} to ${payoutAddress}! See txn here: ${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/txn/${transactionHash}`
				);
				setShowSuccessModal(true);
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
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
						<button
							type="submit"
							className="confirm-btn"
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
