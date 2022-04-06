import { useState, useEffect } from 'react';

const useIsOnCorrectNetwork = (account) => {
	const { chainId } = useWeb3();
	const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState([]);

	useEffect(() => {
		setIsOnCorrectNetwork(
			chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['chainId'] ==
			chainId
		);
	}, [chainId]);

	return [isOnCorrectNetwork, setIsOnCorrectNetwork];
};

export default useIsOnCorrectNetwork;