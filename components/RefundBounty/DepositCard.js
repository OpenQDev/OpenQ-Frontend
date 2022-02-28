// Third Party
import React, { useContext } from 'react';
import { ethers } from 'ethers';
import StoreContext from '../../store/Store/StoreContext';

const DepositCard = ({ deposit, refundBounty, canRefund }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const { tokenMetadata } = appState;

	// State
	const token = tokenMetadata[ethers.utils.getAddress(deposit.tokenAddress)];

	const enableOrDisable = canRefund ? 'confirm-btn cursor-pointer' : 'confirm-btn-disabled cursor-not-allowed';
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
				{deposit.refunded ?
					(<div className="pt-5 text-center font-semibold text-white">
						Refunded on: {appState.utils.formatUnixDate(parseInt(deposit.refundTime))}
					</div>)
					:
					(<div className="pt-5 text-center font-semibold text-white">
						Refundable on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}
					</div>)
				}
				<button disabled={!canRefund} className={classes} onClick={() => refundBounty(deposit.id)}>
					Refund
				</button>
			</div>
		</div >
	);
};

export default DepositCard;
