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
		const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/hasSignature?address=${account}`, { withCredentials: true });
		if (response.data.status===false) {
			const signature = await signMessage(account);
			await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/verifySignature`,
				{
					signature,
					address: account
				}, { withCredentials: true }
			);
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