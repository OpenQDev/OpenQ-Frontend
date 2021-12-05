// Third Party
import React, { useState, useContext } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import ErrorModal from '../ErrorModal';
import ConfirmClaimModal from '../ConfirmClaimModal';
import SuccessModal from '../SuccessModal';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const FundBounty = (props) => {
	const { address } = props;

	// Context
	const [appState] = useContext(StoreContext);
	const { library } = useWeb3();

	// Methods
	async function refundBounty() {
		const txnReceipt = await appState.openQClient.refundBounty(library, address.toLowerCase());
		console.log(txnReceipt);
	}

	// Render
	return (
		<>
			<div>
				<button
					className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
					onClick={() => refundBounty()}
				>Refund</button>
			</div>
		</>
	);
};

export default FundBounty;
