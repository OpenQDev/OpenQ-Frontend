// Third Party
import React from 'react';
import ErrorModal from '../ErrorModal';
import ConfirmationModal from '../ConfirmationModal';
import SuccessModal from '../SuccessModal';

const ConfirmErrorSuccessModalsTrio = (props) => {
	const {
		showSuccessModal,
		setShowSuccessModal,
		successMessage,
		transactionHash,

		showErrorModal,
		setShowErrorModal,
		errorMessage,

		showConfirmationModal,
		confirmMethod,
		confirmationMessage,
		confirmationTitle,
		setShowConfirmationModal,
		positiveOption,
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
					successMessage={successMessage}
					transactionHash={transactionHash}
				/>
			)}
		</>
	);
};

export default ConfirmErrorSuccessModalsTrio;
