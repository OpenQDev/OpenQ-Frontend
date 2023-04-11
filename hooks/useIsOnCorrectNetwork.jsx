import { useState, useEffect } from 'react';
import useWeb3 from './useWeb3';
import chainIdDeployEnvMap from '../components/WalletConnect/chainIdDeployEnvMap';

const useIsOnCorrectNetwork = (props) => {
  const { chainId, error, account } = useWeb3(props);
  console.log(account);
  const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);
  const correctChainId = chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['chainId'];

  useEffect(() => {
    if (error?.message?.includes('Unsupported chain id') || (correctChainId !== chainId && account)) {
      setIsOnCorrectNetwork(false);
    } else {
      setIsOnCorrectNetwork(true);
    }
  }, [chainId, error?.message, account]);
  return [isOnCorrectNetwork, setIsOnCorrectNetwork];
};

export default useIsOnCorrectNetwork;
