// Third Party
import React, { useState, useContext } from 'react';
import useWeb3 from '../../hooks/useWeb3';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const FundBounty = (props) => {
	const { address } = props;

	// Context
	const [appState] = useContext(StoreContext);
	const { library } = useWeb3();

	// State
	const [value, setValue] = useState(null);

	// Methods
	async function approve() {
		const txnReceipt = appState.openQClient.approve(library, address, '0x5FbDB2315678afecb367f032d93F642f64180aa3', value);
		console.log(txnReceipt);
	}

	async function fundBounty() {
		const txnReceipt = await appState.openQClient.fundBounty(library, address, '0x5FbDB2315678afecb367f032d93F642f64180aa3', value);
		console.log(txnReceipt);
	}

	// Render
	return (
		<div>
			<input
				className="bg-pink-100 box-content xl:w-80 lg:w-64 md:w-44 sm:w-32 w-18 border-pink-100 outline-none"
				onChange={(event) => {
					setValue(event.target.value);
				}} />
			<br />
			<br />
			<button
				className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
				onClick={() => approve()}
			>Approve with Mock Link</button>
			<br />
			<button
				className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
				onClick={() => fundBounty()}
			>Fund with Mock Link</button>
		</div>
	);
};

export default FundBounty;
