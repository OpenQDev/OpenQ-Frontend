// Third Party
import React, { useRef, useEffect } from 'react';

// Custom
import {
	CONFIRM,
	APPROVING,
	TRANSFERRING,
	SUCCESS,
	ERROR
} from './ApproveTransferState';

const ApproveTransferModal = ({
	approveTransferState,
	transactionHash,
	setShowApproveTransferModal,
	resetState,
	error,
	confirmationMessage,
	positiveOption,
	confirmMethod,
	approvingMessage,
	approvingTitle
}) => {
	const modal = useRef();
	const updateModal = () => {
		resetState();
		setShowApproveTransferModal(false);
	};


	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target)) {
				updateModal();
			}
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal]);

	let title = {
		[CONFIRM]: 'Confirm',
		[APPROVING]: approvingTitle || 'Approve',
		[TRANSFERRING]: 'Transfer',
		[SUCCESS]: 'Transfer Complete!',
		[ERROR]: `${error.title}`,
	};

	let message = {
		[CONFIRM]: `${confirmationMessage}`,
		[APPROVING]: approvingMessage || 'Approving...',
		[TRANSFERRING]: 'Transferring...',
		[SUCCESS]: `Transaction confirmed! Transaction hash is: ${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}.`,
		[ERROR]: `${error.message}`,
	};

	return (
		<div>
			<div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div ref={modal} className="w-1/4">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl text-white text-center font-semibold pb-8">
									{title[approveTransferState]}
								</div>
							</div>
						</div>
						<div className="flex-auto">
							<p className="text-md text-white pb-12 text-center break-words">
								{message[approveTransferState]}
							</p>
						</div>
						{approveTransferState == 'CONFIRM' ? (
							<div className="flex items-center">
								<button
									className="text-white background-transparent confirm-btn font-bold px-6 py-2 text-lg"
									type="button"
									onClick={() => {
										confirmMethod();
									}}
								>
									{positiveOption}
								</button>
							</div>
						) : null}
						{approveTransferState == ERROR || approveTransferState == SUCCESS ? (
							<div className="flex items-center justify-end p-5 text-lg rounded-b">
								<button
									className="text-white confirm-btn"
									type="button"
									onClick={() => updateModal()}
								>
									Close
								</button>
							</div>
						) : null}
					</div>
				</div>
			</div>
			<div className="bg-overlay fixed inset-0"></div>
		</div>
	);
};

export default ApproveTransferModal;
