import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
import { ethers } from 'ethers';

const useGetTokenValues = (tokenBalances) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	useEffect(async() => {
		const value =	await	appState.tokenClient.parseTokenValues(tokenBalances);
		setTokenValues(value);
	}, [tokenBalances]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;