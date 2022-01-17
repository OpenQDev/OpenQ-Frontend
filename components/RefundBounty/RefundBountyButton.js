// Third Party
import React, { useState, useContext, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import LoadingIcon from '../Loading/LoadingIcon';

const RefundBountyButton = (props) => {
	const { address, issueUrl, bounty } = props;

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
	const [appState] = useContext(StoreContext);
	const { library, account } = useWeb3();

	useEffect(() => {
		if (issueUrl) {
			setConfirmationMessage(
				`You are about to refund your deposits on issue ${issueUrl} to the address ${account}. Is this correct ?`
			);
		}
	}, [issueUrl]);

	// Methods
	async function refundBounty() {
		setIsLoading(true);
		appState.openQClient
			.refundBounty(library, address)
			.then((txnReceipt) => {
				setTransactionHash(txnReceipt.transactionHash);
				setSuccessMessage('Money refunded!');
				setShowSuccessModal(true);
				setIsLoading(false);
			})
			.catch((error) => {
				setTransactionHash(JSON.stringify(error));
				if (
					error?.data?.message?.includes(
						'Only funders of this bounty can reclaim funds after 30 days'
					)
				) {
					setErrorMessage(
						`Only funders can request refunds on this issue. Your address ${account} has not funded this issue.`
					);
				}
				if (error?.data?.message?.includes('Too early to withdraw funds')) {
					setErrorMessage(
						`Too Early To Withdraw Funds! Bounty was minted on ${appState.utils.formatUnixDate(
							bounty.bountyMintTime
						)}. You must wait until 30 days after mint date to get a refund.`
					);
				} else {
					setErrorMessage(error?.message);
				}
				setIsLoading(false);
				setShowErrorModal(true);
			});
	}

	// Render
	return (
		<>
			<div className="flex justify-center items-center">
				<div className="pt-16 flex flex-col space-y-5 w-1/2">
					<div className="text-3xl font-semibold text-white text-center">
            Refund Bounty{' '}
					</div>
					<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
            To refund this bounty the deposits must be stored in the Smart
            Contract for at least 30 days.
					</div>
					<button
						className="p-2 py-3 confirm-btn "
						onClick={() => setShowConfirmationModal(true)}
					>
            Refund
					</button>
				</div>
				{isLoading && <LoadingIcon />}
				<ConfirmErrorSuccessModalsTrio
					setShowErrorModal={setShowErrorModal}
					showErrorModal={showErrorModal}
					errorMessage={errorMessage}
					setShowConfirmationModal={setShowConfirmationModal}
					showConfirmationModal={showConfirmationModal}
					confirmationTitle={'Refund Deposits'}
					confirmationMessage={confirmationMessage}
					positiveOption={'Yes, Refund!'}
					confirmMethod={refundBounty}
					showSuccessModal={showSuccessModal}
					setShowSuccessModal={setShowSuccessModal}
					successMessage={successMessage}
					transactionHash={transactionHash}
				/>
			</div>
		</>
	);
};

export default RefundBountyButton;
