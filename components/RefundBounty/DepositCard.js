// Third Party
import React, { useContext } from 'react';
import { ethers } from 'ethers';
import StoreContext from '../../store/Store/StoreContext';

const DepositCard = ({ deposit, bounty, refundBounty }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const { tokenMetadata } = appState;

	// State
	const token = tokenMetadata[ethers.utils.getAddress(deposit.tokenAddress)];

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
					{ethers.utils.formatUnits(deposit.volume, parseInt(token.decimals))} {token.name}
				</div>
				<div className="pt-5 text-center font-semibold text-white">
					Deposited on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime))}
				</div>
				<div className="pt-5 text-center font-semibold text-white">
					Refundable on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + 2592000)}
				</div>
				<div className="pt-5 text-center font-semibold text-white">
					Refunded: {deposit.refunded.toString()}
				</div>
				<button disabled={deposit.refunded || closed} className={classes} onClick={() => refundBounty(deposit.id)}>
					Refund
				</button>
			</div>
		</div >
	);
};

export default DepositCard;
