import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
import { ethers } from 'ethers';

const useGetTokenValues = (tokenBalances) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	async function getTokenValues(tokenBalances) {
		let didCancel = false;
		if (tokenBalances) {
			let tokenVolumes = {};
			if (Array.isArray(tokenBalances)) {
				tokenBalances.map((tokenBalance) => {
					const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalance.tokenAddress)].address;
					tokenVolumes[tokenAddress] = tokenBalance.volume;
				});
			}
			else {
				const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalances.tokenAddress)].address;
				tokenVolumes[tokenAddress] = tokenBalances.volume;
			}
			const data = { tokenVolumes, network: 'polygon-pos' };
			const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
			//only query tvl for bounties that have deposits
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				try {
					const tokenValues = await appState.tokenClient.getTokenValues(data, url);
					if(!didCancel){
						setTokenValues(tokenValues);
					}
				} catch (error) {
					console.error(error);
					didCancel = true;
				}
				didCancel = true;
			} else {
				setTokenValues(null);
			}
			didCancel = true;
		}
	}

	useEffect(async() => {
		let didCancel = false;
		if(didCancel){
			await 	getTokenValues(tokenBalances);
		}
		return ()=>{
			didCancel = false;
		};
	}, [tokenBalances]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;