import { useState, useEffect } from 'react';
import useWeb3 from './useWeb3';
import chainIdDeployEnvMap from '../components/WalletConnect/chainIdDeployEnvMap';

const useIsOnCorrectNetwork = () => {
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