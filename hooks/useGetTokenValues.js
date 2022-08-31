import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
function useAsync(asyncFn, onSuccess, dep) {
	useEffect(() => {
		let isActive = true;
		asyncFn().then(data => {
			if (isActive) onSuccess(data);
		});
		return () => {
			isActive = false;
		};
	}, [asyncFn, onSuccess, dep]);
}
const useGetTokenValues = (tokenBalances, bounty) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	const getParsedTokenValues = async()=>{
		if(JSON.stringify(tokenValues) !== '{}' && tokenBalances){
			const value =	await	appState.tokenClient.parseTokenValues(tokenBalances);
			return value;
		}
		if(tokenBalances?.length === 0){
			return {total:0};
		}
	};
	useAsync(getParsedTokenValues, setTokenValues, bounty);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;
