// Third Party
import React from 'react';
import ErrorModal from '../ErrorModal';
import ConfirmationModal from '../ConfirmationModal';
import SuccessModal from '../SuccessModal';

const ConfirmErrorSuccessModalsTrio = (props) => {
	const {
		showErrorModal,
		showConfirmationModal,
		showSuccessModal,
		setShowErrorModal,
		setShowSuccessModal,
		setShowConfirmationModal,
		positiveOption,
		errorMessage,
		confirmMethod,
		successMessage,
		transactionHash,
		confirmationMessage,
		confirmationTitle
	} = props;

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
				<ConfirmationModal
					setShowConfirmationModal={setShowConfirmationModal}
					confirmationMessage={confirmationMessage}
					confirmationTitle={confirmationTitle}
					positiveOption={positiveOption}
					confirmMethod={confirmMethod}
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
