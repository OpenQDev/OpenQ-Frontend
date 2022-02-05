// Third Party
import React from 'react';
import { ethers } from 'ethers';

const DepositCard = ({ deposit, bounty, refundBounty }) => {
	// Render
	const closed = bounty.status == 'CLOSED';
	const closedOrRefunded = deposit.refunded || closed;
	const enableOrDisable = closedOrRefunded ? 'confirm-btn-disabled cursor-not-allowed' : 'confirm-btn cursor-pointer';
	const classes = `bg-pink text-white rounded shadow-md text-gray-300 font-sans relative ${enableOrDisable}`;

	return (
		<div>
			<div
				className={
					'flex flex-col p-6 items-center font-mont rounded-xl shadow-sm border border-web-gray cursor-pointer pr-11 pl-11'
				}
			>
				<div className="bg-pink text-white rounded shadow-md text-gray-300 font-sans relative">
					{ethers.utils.formatEther(deposit.volume)}
				</div>
				<div className="pt-5 text-center font-semibold text-white">
					Refunded: {deposit.refunded.toString()}
				</div>
				<div className="pt-5 text-center font-semibold text-white">
					Closed: {closed.toString()}
				</div>
				<button disabled={deposit.refunded || closed} className={classes} onClick={() => refundBounty(deposit.id)}>
					Refund
				</button>
			</div>
		</div >
	);
};

export default DepositCard;
