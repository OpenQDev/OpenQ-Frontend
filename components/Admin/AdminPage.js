// Third party Libraries
import React, { useState, useRef, useContext } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import axios from 'axios';
import StoreContext from '../../store/Store/StoreContext';

const AdminPage = ({ bounty, refreshBounty }) => {

	const { library, account, } = useWeb3();
	const [appState, dispatch] = useContext(StoreContext);
	const [error, setError] = useState('');

	// Show different things depending on the bounty type, whether the competition is closed, etc

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

	return (
		<>
			<button
				type="button"
				onClick={closeCompetition}
			>Close Competition</button>
		</>
	);
};

export default AdminPage;
