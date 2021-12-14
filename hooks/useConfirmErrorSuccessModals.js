import { useState } from 'react';

const useConfirmErrorSuccessModals = () => {
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	return { showErrorModal, setShowErrorModal, showSuccessModal, setShowSuccessModal, showConfirmationModal, setShowConfirmationModal };
};

export default useConfirmErrorSuccessModals;