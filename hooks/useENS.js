import { useState, useEffect, useContext } from 'react';

import StoreContext from '../store/Store/StoreContext';

const useEns = (account) => {
	const [appState] = useContext(StoreContext);
	const [ensName, setEnsName] = useState(account);
	useEffect(async() => {
		const ensName = await appState.openQClient.getENS(account);
		setEnsName(ensName&&ensName);
	}, []);
	return [ensName, setEnsName];
};

export default useEns;