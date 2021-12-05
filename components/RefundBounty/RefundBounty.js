// Third Party
import React, { useState, useContext, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import ConfirmErrorSuccessModalsTrio from '../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio';
import useConfirmErrorSuccessModals from '../../hooks/useConfirmErrorSuccessModals';
import LoadingIcon from '../LoadingIcon';

const RefundBounty = (props) => {
	const { address, issueUrl } = props;

	const { showErrorModal, setShowErrorModal, showSuccessModal, setShowSuccessModal, showConfirmationModal, setShowConfirmationModal } = useConfirmErrorSuccessModals();
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);

	// Context
	const [appState] = useContext(StoreContext);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const { library, account } = useWeb3();

	useEffect(() => {
		if (issueUrl) {
			setConfirmationMessage(`You are about to refund your deposits on issue ${issueUrl} to the address ${account}. Is this correct ?`);
			console.log(confirmationMessage);
		}
	}, [issueUrl]);

	// Methods
	async function refundBounty() {
		setIsLoading(true);
		appState.openQClient.refundBounty(library, address.toLowerCase())
			.then(txnReceipt => {
				console.log(txnReceipt);
				setTransactionHash(txnReceipt.transactionHash);
				setSuccessMessage('Money refunded!');
				setShowSuccessModal(true);
				setIsLoading(false);
			})
			.catch(error => {
				console.log(error);
				setTransactionHash(JSON.stringify(error));
				setErrorMessage(JSON.stringify(error));
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

export default RefundBounty;
