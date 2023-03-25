import { useState, useEffect, useContext } from 'react';
import chainIdDeployEnvMap from '../components/WalletConnect/chainIdDeployEnvMap';
import { walletConnect, metaMask } from '../components/WalletConnect/connectors';
import StoreContext from '../store/Store/StoreContext';

import useWeb3 from './useWeb3';

// inspired by https://github.com/Uniswap/interface/blob/ffe670923e418c18c1f977c5f4f636b5022281b9/src/hooks/useEagerlyConnect.ts
export default function useEagerConnect() {
  const { active } = useWeb3();
  const [appState] = useContext(StoreContext);

  const [tried, setTried] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        if (walletConnect.defaultChainId !== chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]) {
          await walletConnect.connectEagerly();
        } else {
          appState.logger.info(
            `WalletConnect chainId mismatch,
            ${walletConnect.defaultChainId},
           ${chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]?.chainId},
            'useEagerConnect.js'`
          );
        }
      } catch (error) {
        if (error.message && !error.message.includes('No active session found.')) {
          appState.logger.info(error, 'useEagerConnect.js');
        }

        if (window.ethereum?.isMetaMask) {
          metaMask.connectEagerly();
          return;
        }
      }
    };

    connect();
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
