// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useWeb3 from '../../hooks/useWeb3';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/BountyCard/BountyCardDetails';

const FundBounty = (props) => {
	const { address } = props;

	// Context
	const [appState] = useContext(StoreContext);
	const { library } = useWeb3();

	// State
	const [bounty, setBounty] = useState(null);
	const [value, setValue] = useState(null);

	// Methods
	async function approve() {
		const approved = await appState.openQClient.approve(library, address, "0x5FbDB2315678afecb367f032d93F642f64180aa3", value);
	}

	async function fundBounty() {
		const funded = await appState.openQClient.fundBounty(library, address.toLowerCase(), "0x5FbDB2315678afecb367f032d93F642f64180aa3", value);
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
			>Approve with Mock Token</button>
			<br />
			<button
				className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
				onClick={() => fundBounty()}
			>Fund with Mock Token</button>
		</div>
	);
};

export default FundBounty;
