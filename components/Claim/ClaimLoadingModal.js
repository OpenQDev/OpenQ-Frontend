// Third Party
import React, { useState } from 'react';

// Custom
import {
	CHECKING_WITHDRAWAL_ELIGIBILITY,
	WITHDRAWAL_ELIGIBLE,
	WITHDRAWAL_INELIGIBLE,
	TRANSACTION_SUBMITTED,
	TRANSACTION_CONFIRMED
} from "./ClaimStates";

const ClaimLoadingModal = ({ claimState, login, address, transactionHash }) => {

	let title = {
		[CHECKING_WITHDRAWAL_ELIGIBILITY]: () => "Validating Claim",
		[WITHDRAWAL_ELIGIBLE]: () => "You are the one!",
		[WITHDRAWAL_INELIGIBLE]: () => "Withdrawal Ineligible",
		[TRANSACTION_SUBMITTED]: () => "Transaction Submitted",
		[TRANSACTION_CONFIRMED]: () => 'Transaction Confirmed!',
	};

	let message = {
		[CHECKING_WITHDRAWAL_ELIGIBILITY]: () => `Checking that you are indeed the droid we are looking for...`,
		[WITHDRAWAL_ELIGIBLE]: () => "You are indeed the droid we are looking for. Transaction pending...",
		[WITHDRAWAL_INELIGIBLE]: () => "You are NOT the droid we are looking for.",
		[TRANSACTION_SUBMITTED]: () => "Submitted transaction.",
		[TRANSACTION_CONFIRMED]: () => `Transaction confirmed! All funds from this bounty will appear in your address at ${address}`,
	};

	return (
		<div>
			<div className="justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-1/4">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl text-white font-semibold pb-8">
									{title[claimState]()}
								</div>
							</div>
						</div>
						<div className="flex-auto">
							<p className="text-md text-white pb-12 text-center">
								{message[claimState]()}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-70 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default ClaimLoadingModal;
