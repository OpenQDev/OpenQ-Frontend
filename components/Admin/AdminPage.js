// Third party Libraries
import React, { useState, useRef, useContext } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import axios from 'axios';
import StoreContext from '../../store/Store/StoreContext';

const AdminPage = ({ bounty, refreshBounty }) => {

	// Context
	const { library, account, } = useWeb3();
	const [appState, dispatch] = useContext(StoreContext);

	// State
	const [error, setError] = useState('');

	async function closeCompetition() {
		try {
			await appState.openQClient.closeCompetition(library, bounty.bountyId);
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
			console.log({ message, title });
		}
	}

	async function closeOngoing() {
		try {
			await appState.openQClient.closeOngoing(library, bounty.bountyId);
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
			console.log({ message, title });
		}
	}

	if (bounty.bountyType == '2') {
		return (
			<>
				<button
					type="button"
					onClick={closeCompetition}
				>Close Competition</button>
			</>
		);
	} else if (bounty.bountyType == '1') {
		return (
			<>
				<button
					type="button"
					onClick={closeOngoing}
				>Close Ongoing Bounty</button>
			</>
		);
	}
};

export default AdminPage;
