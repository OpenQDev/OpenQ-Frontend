import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
import { ethers } from 'ethers';

const getTokenValues = async (tokenBalances) => {
	const [appState] = useContext(StoreContext);

	return new Promise(async (resolve, reject) => {
		if (tokenBalances != null) {
			let tokenVolumes = {};
			tokenBalances.map((tokenBalance) => {
				const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalance.tokenAddress)].address;
				tokenVolumes[tokenAddress] = tokenBalance.volume;
			});

			const data = { tokenVolumes };
			const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
			//only query tvl for bounties that have deposits
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				try {
					const tokenValues = await appState.tokenClient.getTokenValues(data, url);
					resolve(tokenValues);
				} catch (error) {
					reject(error);
				}
			} else {
				resolve(null);
			}
		}
	});
};

export default getTokenValues;