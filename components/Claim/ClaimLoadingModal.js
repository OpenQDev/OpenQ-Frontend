// Third party
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

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
		[TRANSACTION_SUBMITTED]: 'You are indeed the droid we are looking for. See your pending transaction here: ',
		[TRANSACTION_CONFIRMED]: 'Transaction confirmed!  Check out your transaction with the link below: ',
	};

	let link = {
		[TRANSACTION_CONFIRMED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
		[TRANSACTION_SUBMITTED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`
	};

	let afterLink = {
		[TRANSACTION_CONFIRMED]: `All funds from this bounty will appear in your address at ${address}.`,
		[TRANSACTION_SUBMITTED]: ''
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
		if (claimState !== TRANSACTION_SUBMITTED && claimState !== CHECKING_WITHDRAWAL_ELIGIBILITY) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal, claimState]);

	return (
		<div>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 left-20 z-50 outline-none focus:outline-none">
				<div ref={modal} className="w-1/4 min-w-[320px]">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none text-center">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl  font-semibold pb-8">
									{title[claimState]}
								</div>
							</div>
						</div>
						<p className="text-md  pb-2 break-words">
							<span>
								{message[claimState]}
							</span>
							{link[claimState] &&
								<div>
									<>
										<Link href={link[claimState]}>
											<a className="underline break-all" target="_blank" rel="noopener noreferrer" >
												{link[claimState]}
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative bottom-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
													<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
											</a>
										</Link>
									</>
									<p>
										{afterLink[claimState]}
									</p>
								</div>
							}
						</p>
						{claimState == WITHDRAWAL_INELIGIBLE || claimState == TRANSACTION_CONFIRMED ? (
							<div className="flex items-center justify-end p-5 text-lg rounded-b">
								<button
									className=" confirm-btn"
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
										className=" background-transparent confirm-btn font-bold px-6 py-2 text-lg"
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

						{(claimState === CHECKING_WITHDRAWAL_ELIGIBILITY || claimState === TRANSACTION_SUBMITTED) &&
							<div className='self-center'><LoadingIcon bg="colored" /></div>
						}
					</div>
				</div>
			</div>
			<div onClick={() => updateModal()} className="bg-overlay absolute inset-0"></div>
		</div >
	);
};

export default ClaimLoadingModal;
