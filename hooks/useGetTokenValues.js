import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StoreContext from '../store/Store/StoreContext';
import { ethers } from 'ethers';

const useGetTokenValues = (bounty) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	useEffect(async () => {
		if (bounty != null) {
			let tokenVolumes = {};
			bounty.bountyTokenBalances.map((tokenBalance) => {
				const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalance.tokenAddress)].address;
				tokenVolumes[tokenAddress] = tokenBalance.volume;
			});

			const data = { tokenVolumes };
			const url = appState.coinApiBaseUrl + '/tvl';
			//only query tvl for bounties that have deposits
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				try {
					const tokenValues = await appState.tokenClient.getTokenValues(data, url);
					setTokenValues(tokenValues);
				} catch (error) {
					console.error(error);
				}
			} else {
				setTokenValues(null);
			}
		}
	}, [bounty]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;