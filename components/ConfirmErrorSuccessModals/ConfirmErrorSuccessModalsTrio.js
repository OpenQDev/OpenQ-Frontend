// Third Party
import React from 'react';
import ErrorModal from '../ErrorModal';
import ConfirmClaimModal from '../ConfirmClaimModal';
import SuccessModal from '../SuccessModal';

const ConfirmErrorSuccessModalsTrio = (props) => {
	const {
		showErrorModal,
		showConfirmationModal,
		showSuccessModal,
		setShowErrorModal,
		setShowSuccessModal,
		setShowConfirmationModal,
		account,
		issueUrl,
		errorMessage,
		claimBounty,
		successMessage,
		transactionHash } = props;

	// Render
	return (
		<>
			{showErrorModal && (
				<ErrorModal
					setShowErrorModal={setShowErrorModal}
					errorMessage={errorMessage}
				/>
			)}
			{showConfirmationModal && (
				<ConfirmClaimModal
					setShowConfirmationModal={setShowConfirmationModal}
					address={account}
					claimBounty={claimBounty}
					issueUrl={issueUrl}
				/>
			)}
			{showSuccessModal && (
				<SuccessModal
					setShowSuccessModal={setShowSuccessModal}
					message={successMessage}
					transactionHash={transactionHash}
				/>
			)}
		</>
	);
};

export default ConfirmErrorSuccessModalsTrio;
