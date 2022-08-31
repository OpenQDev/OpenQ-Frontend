import { ethers } from 'ethers';
import axios from 'axios';

const	signMessage = async (account) => {
	const message = 'OpenQ';
	const signature = await window.ethereum
		.request({
			method: 'personal_sign',
			params: [message, account]
		});
	return signature;
};

const watchBounty = async (context, account, bounty, watchingDisplay, setWatchingDisplay) => {
	const [appState, dispatch]= context;
	if(!account){const payload = {
		type: 'CONNECT_WALLET',
		payload: true
	};
	dispatch(payload);
	return; 
	}
	try {
		const response = await appState.authService.hasSignature(account);
		if (response.data.status===false) {
			const signature = await signMessage(account);
			await appState.authService.verifySignature(account, signature);
		}


		if (watchingDisplay) {
			await appState.openQPrismaClient.unWatchBounty(ethers.utils.getAddress(bounty.bountyAddress), account);
			setWatchingDisplay(false);
		} else {
			await appState.openQPrismaClient.watchBounty(ethers.utils.getAddress(bounty.bountyAddress), account);
			setWatchingDisplay(true);
		}

		const payload = {
			type: 'RELOAD_NOW',
			payload: Date.now()
		};
		dispatch(payload);

	} catch (error) {
		console.error(error);
	}
};

export default watchBounty;