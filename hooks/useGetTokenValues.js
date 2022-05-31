import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';

const useGetTokenValues = (tokenBalances) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	useEffect(async() => {
		let didCancel;
		if(JSON.stringify(tokenValues) !== '{}' && !didCancel){
			if(!didCancel){
				const value =	await	appState.tokenClient.parseTokenValues(tokenBalances);
				console.log(didCancel);
				setTokenValues(value);
			}
			didCancel = true;
		}
		return () => didCancel = true;
	}, [tokenBalances]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;