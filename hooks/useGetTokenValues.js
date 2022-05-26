import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';

const useGetTokenValues = (tokenBalances) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	useEffect(async() => {
		if(JSON.stringify(tokenValues) !== '{}'){
			const value =	await	appState.tokenClient.parseTokenValues(tokenBalances);
			setTokenValues(value);}
	}, [tokenBalances]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;