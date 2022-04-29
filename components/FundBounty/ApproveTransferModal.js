// Third party
import React, { useRef, useEffect } from 'react';

// Custom
import {
	CONFIRM,
	APPROVING,
	TRANSFERRING,
	SUCCESS,
	ERROR
} from './ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Link from 'next/link';

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
		if (approveTransferState !== APPROVING && approveTransferState !== TRANSFERRING) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal, approveTransferState]);

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
		[SUCCESS]: `Transaction confirmed! Check out your transaction with the link below:\n
		`,
		[ERROR]: `${error.message}`,
	};

	let link = {
		[SUCCESS]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
	};

	return (
		<div>
			<div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div ref={modal} className="w-1/4 min-w-[320px]">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl text-white text-center font-semibold pb-8">
									{title[approveTransferState]}
								</div>
							</div>
						</div>
						<div className="text-md text-white text-center pb-4">
							<p className="break-words">
								{message[approveTransferState]}
							</p>
							{link[approveTransferState] &&
								<p className='break-all underline'>
									<Link href={link[approveTransferState]}>
										<a target={'_blank'}>
											{link[approveTransferState]}
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
												<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</a>
									</Link>
								</p>}
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
						{(approveTransferState === TRANSFERRING || approveTransferState === APPROVING) &&
							<div className='self-center'><LoadingIcon bg="colored" /></div>
						}
					</div>
				</div>
			</div>
			<div className="bg-overlay fixed inset-0"></div>
		</div>
	);
};

export default ApproveTransferModal;
