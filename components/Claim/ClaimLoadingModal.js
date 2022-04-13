// Third Party
import React, { useRef,  useEffect } from 'react';

// Custom
import {
	CHECKING_WITHDRAWAL_ELIGIBILITY,
	WITHDRAWAL_INELIGIBLE,
	TRANSACTION_SUBMITTED,
	TRANSACTION_CONFIRMED,
	CONFIRM_CLAIM
} from './ClaimStates';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

const ClaimLoadingModal = ({ confirmMethod, url, ensName, account, claimState, address, transactionHash, setShowClaimLoadingModal, error }) => {

	const updateModal = () => {
		setShowClaimLoadingModal(false);
	};
	
	const modal = useRef();
	

	let title = {
		[CONFIRM_CLAIM]: 'Confirm Claim',
		[CHECKING_WITHDRAWAL_ELIGIBILITY]: 'Validating Claim',
		[WITHDRAWAL_INELIGIBLE]: 'Withdrawal Ineligible',
		[TRANSACTION_SUBMITTED]: 'Transaction Submitted',
		[TRANSACTION_CONFIRMED]: 'Transaction Confirmed!',
	};

	let message = {
		[CONFIRM_CLAIM]: `You are about to claim the deposits on issue ${url} to the address ${ensName || account}. Is this correct ?`,
		[CHECKING_WITHDRAWAL_ELIGIBILITY]: 'Checking that you are indeed the droid we are looking for...',
		[WITHDRAWAL_INELIGIBLE]: `You are NOT the droid we are looking for. ${error.message}`,
		[TRANSACTION_SUBMITTED]: 'You are indeed the droid we are looking for. Transaction pending...',
		[TRANSACTION_CONFIRMED]: `Transaction confirmed! Transaction hash is: ${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}. All funds from this bounty will appear in your address at ${address}`,
	};

	// Hooks

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

	return (
		<div>
			<div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div ref = {modal} className="w-1/4">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl text-white font-semibold pb-8">
									{title[claimState]}
								</div>
							</div>
						</div>
						<div className="flex-auto">
							<p className="text-md text-white pb-4 text-center break-words">
								{message[claimState]}
							</p>
						</div>
						{claimState == WITHDRAWAL_INELIGIBLE || claimState == TRANSACTION_CONFIRMED ? (
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
						{claimState == CONFIRM_CLAIM ? (
							<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
								<div className="flex items-center">
									<button
										className="text-white background-transparent confirm-btn font-bold px-6 py-2 text-lg"
										type="button"
										onClick={() => {
											confirmMethod();
										}}
									>
										Yes! Claim!
									</button>
								</div>
							</div>
						) : null}
						
						{(claimState===CHECKING_WITHDRAWAL_ELIGIBILITY || claimState === TRANSACTION_SUBMITTED) &&
						<div className='self-center'><LoadingIcon bg="colored" /></div>
						}
					</div>
				</div>
			</div>
			<div onClick={()=> updateModal()} className="bg-overlay absolute inset-0"></div>
		</div >
	);
};

export default ClaimLoadingModal;
