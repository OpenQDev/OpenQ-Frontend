import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
import { ethers } from 'ethers';

const useGetTokenValues = (tokenBalances) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	async function getTokenValues(tokenBalances) {
		
		if (tokenBalances != null) {
			let tokenVolumes = {};
			if(Array.isArray(tokenBalances)){
				tokenBalances.map((tokenBalance) => {
					const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalance.tokenAddress)].address;
					tokenVolumes[tokenAddress] = tokenBalance.volume;
				});
			}
			else{
				const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalances.tokenAddress)].address;
				tokenVolumes[tokenAddress] = tokenBalances.volume;
			}
			const data = { tokenVolumes };
			const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
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
	}

	useEffect(() => {
		getTokenValues(tokenBalances);
	}, [tokenBalances]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;