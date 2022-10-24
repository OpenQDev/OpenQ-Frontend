import { useState, useEffect } from 'react';
import { walletConnect, metaMask, gnosisSafe } from '../components/WalletConnect/connectors';

import useWeb3 from './useWeb3';

// inspired by https://github.com/Uniswap/interface/blob/ffe670923e418c18c1f977c5f4f636b5022281b9/src/hooks/useEagerlyConnect.ts
export default function useEagerConnect() {
  const { active } = useWeb3();

  const [tried, setTried] = useState(false);
  useEffect(async () => {
    try {
      await gnosisSafe.activate();
    } catch {
      try {
        await walletConnect.connectEagerly();
      } catch (err) {
        if (window.ethereum?.isMetaMask) {
          metaMask.connectEagerly();
          return;
        }
      }
    }
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
