import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';

const useGetTokenValues = (tokenBalances, bounty) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	useEffect(async() => {
		let didCancel;
		if(JSON.stringify(tokenValues) !== '{}' && !didCancel && tokenBalances){
			const value =	await	appState.tokenClient.parseTokenValues(tokenBalances);
			if(!didCancel){
				setTokenValues(value);
			}
			
		}
		if(tokenBalances?.length === 0){
			setTokenValues({total:0});
			return () =>{ didCancel = true;};
		}
		return () =>{ didCancel = true;};
	}, [bounty? bounty : tokenBalances]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;
