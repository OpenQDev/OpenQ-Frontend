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

	const { showErrorModal, setShowErrorModal, showSuccessModal, setShowSuccessModal, showConfirmationModal, setShowConfirmationModal } = useConfirmErrorSuccessModals();
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
			setConfirmationMessage(`You are about to refund your deposits on issue ${issueUrl} to the address ${account}. Is this correct ?`);
		}
	}, [issueUrl]);

	// Methods
	async function refundBounty() {
		setIsLoading(true);
		appState.openQClient.refundBounty(library, address)
			.then(txnReceipt => {
				setTransactionHash(txnReceipt.transactionHash);
				setSuccessMessage('Money refunded!');
				setShowSuccessModal(true);
				setIsLoading(false);
			})
			.catch(error => {
				setTransactionHash(JSON.stringify(error));
				if (error?.data?.message?.includes('Only funders of this bounty can reclaim funds after 30 days')) {
					setErrorMessage(`Only funders can request refunds on this issue. Your address ${account} has not funded this issue.`);
				}
				if (error?.data?.message?.includes('Too early to withdraw funds')) {
					setErrorMessage(`Too Early To Withdraw Funds! Bounty was minted on ${appState.utils.formatUnixDate(bounty.bountyMintTime)}. You must wait until 30 days after mint date to get a refund.`);
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
			<div>
				<button
					className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
					onClick={() => setShowConfirmationModal(true)}
				>Refund</button>
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
