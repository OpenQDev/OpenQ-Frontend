// Third Party
import React from 'react';

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
	address,
	transactionHash,
	setShowApproveTransferModal,
	resetState,
	error,
	confirmationMessage,
	positiveOption,
	confirmMethod
}) => {

	const updateModal = () => {
		resetState();
		setShowApproveTransferModal(false);
	};

	let title = {
		[CONFIRM]: 'Confirm',
		[APPROVING]: 'Approve',
		[TRANSFERRING]: 'Transfer',
		[SUCCESS]: 'Transfer Complete!',
		[ERROR]: `${error.title}`,
	};

	let message = {
		[CONFIRM]: `${confirmationMessage}`,
		[APPROVING]: 'Approving...',
		[TRANSFERRING]: 'Transferring...',
		[SUCCESS]: `Transaction confirmed! Transaction hash is: ${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}. All funds from this bounty will appear in your address at ${address}`,
		[ERROR]: `${error.message}`,
	};

	return (
		<div>
			<div onClick={()=>updateModal()} className="eh justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-1/4">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl text-white font-semibold pb-8">
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
										updateModal();
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
			<div className="opacity-70 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default ApproveTransferModal;
