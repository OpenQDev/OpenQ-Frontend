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

const ClaimPage = ({ bounty, refreshBounty }) => {
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
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);

	const claimed = bounty.status == 'CLOSED';

	// Context
	const { account, library } = useWeb3();
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
			.then(async (result) => {
				console.log('Result received from /claim: ', result);
				const { payoutAddress, txnHash } = result.data;
				// Upon this return, the claimBounty transaction has been submitted
				// We should now transition from Transaction Submitted -> Transaction Pending
				await library.waitForTransaction(txnHash);
				// We should check here for txn failure before proceeding to Transaction Success
				setIsLoading(false);
				setTransactionHash(txnHash);
				setSuccessMessage(
					`Successfully transferred bounties on issue at ${url} to ${payoutAddress}!`
				);
				setShowSuccessModal(true);
				refreshBounty();
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				setError({ message: error.response.data.errorMessage, title: 'Error' });
				setShowErrorModal(true);
			});
	};

	if (claimed) {
		return (
			<div className="pt-16">
				<div className="flex flex-col space-y-5">
					<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
						Bounty Is Already Closed
					</div>
				</div>
			</div>
		);
	} else {
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
							redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyAddress}`}
						/>
						{isLoading && <LoadingIcon />}
					</div>
				</div>
				<ConfirmErrorSuccessModalsTrio
					setShowErrorModal={setShowErrorModal}
					showErrorModal={showErrorModal}
					error={error}
					setShowConfirmationModal={setShowConfirmationModal}
					showConfirmationModal={showConfirmationModal}
					confirmationTitle={'Confirm Claim'}
					confirmationMessage={confirmationMessage}
					confirmMethod={claimBounty}
					positiveOption={'Yes, Claim!'}
					transactionHash={transactionHash}
					showSuccessModal={showSuccessModal}
					setShowSuccessModal={setShowSuccessModal}
					successMessage={successMessage}
				/>
			</div>
		);
	}
};

export default ClaimPage;
