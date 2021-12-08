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
				await axios
					.post(url, data)
					.then((result) => {
						setTokenValues({ ...result.data });
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setTokenValues({});
			}
		}
	}, [bounty]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;