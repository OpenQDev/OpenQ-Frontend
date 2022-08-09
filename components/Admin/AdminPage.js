// Third party Libraries
import React, { useState, useEffect, useContext } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';

const AdminPage = ({ bounty, refreshBounty }) => {

	// Context
	const { library, account, } = useWeb3();
	const [appState, dispatch] = useContext(StoreContext);

	// State
	const [error, setError] = useState('');
	const [showButton, setShowButton] = useState(ethers.utils.getAddress(bounty.issuer.id) == account && !bounty.bountyClosedTime)

	async function closeCompetition() {
		try {
			await appState.openQClient.closeCompetition(library, bounty.bountyId);
			setShowButton(false);
			refreshBounty();
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
			setShowButton(false);
			refreshBounty();
		} catch (error) {
			console.log(error);
			const { message, title } = appState.openQClient.handleError(error, { bounty });
			setError({ message, title });
			console.log({ message, title });
		}
	}

	if (showButton) {
		if (bounty.bountyType == '2') {
			return (
				<>
					<button
						className="btn-default"
						type="button"
						onClick={closeCompetition}
					>Close Competition</button>
				</>
			);
		} else if (bounty.bountyType == '1') {
			return (
				<>
					<button
						className="btn-default"
						type="button"
						onClick={closeOngoing}
					>Close Ongoing Bounty</button>
				</>
			);
		} else {
			return null;
		}
	} else {
		return null;
	}

};

export default AdminPage;
