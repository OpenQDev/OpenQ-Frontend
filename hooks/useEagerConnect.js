import { useState, useEffect } from 'react';
import { walletConnect, metaMask } from '../components/WalletConnect/connectors';

import useWeb3 from './useWeb3';

export default function useEagerConnect() {
  const { active } = useWeb3();

  const [tried, setTried] = useState(false);

  useEffect(() => {}, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      walletConnect.connectEagerly();
      metaMask.connectEagerly();
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
