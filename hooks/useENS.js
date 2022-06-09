import { useState, useEffect, useContext } from 'react';

import StoreContext from '../store/Store/StoreContext';

const useEns = (account) => {
	const [appState] = useContext(StoreContext);
	const [ensName, setEnsName] = useState();
	useEffect(async() => {
		if(account){
			const localEns = sessionStorage.getItem(`${account}:ens`);
			if(localEns!=='false')		
			{
				if( localEns){
					setEnsName(localEns);
				}
				else{
					const fetchedEnsName =  await appState.openQClient.getENS(account);
					sessionStorage.setItem(`${account}:ens`, fetchedEnsName);
					setEnsName(fetchedEnsName&&fetchedEnsName);
				}
			}
		}
	},[account]);

	return [ensName, setEnsName];
};

export default useEns;