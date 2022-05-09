import { useState, useEffect } from 'react';
import useWeb3 from './useWeb3';
import chainIdDeployEnvMap from '../components/WalletConnect/chainIdDeployEnvMap';

const useIsOnCorrectNetwork = (props) => {
	const { chainId, error, account } = useWeb3(props);
	const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);

	useEffect(async() => {
		if(error?.message?.includes('Unsupported chain id') || (chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['chainId'] !== chainId && account)){
			setIsOnCorrectNetwork(false);
		}
		else{setIsOnCorrectNetwork(true);
		}
	}, [chainId, error?.message]);

	return [isOnCorrectNetwork, setIsOnCorrectNetwork];
};

export default useIsOnCorrectNetwork;