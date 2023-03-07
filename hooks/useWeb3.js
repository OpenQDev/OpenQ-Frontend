import { useWeb3React } from '@web3-react/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useRef } from 'react';

// This is a lightweight wrapper of web3React which allows the frontend to run in local mode without attempting to connect to any localhost chain
const useWeb3 = (kyc) => {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV == 'local') {
    return {
      library: {},
      account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      active: true,
      chainId: 31337,
      activate: () => {},
      deactivate: () => {},
      error: () => {},
    };
  } else {
    const { provider, active, activate, chainId, deactivate, error, connector, account } = useWeb3React();
    let wcProvider;
    const effectRan = useRef(false);
    if (kyc) {
      if (effectRan.current === false) {
        wcProvider = new WalletConnectProvider({
          rpc: {
            137: 'https://rpc-mainnet.maticvigil.com/',
          },
          chainId: 137,
        });
      }
      effectRan.current = true;
    }

    const chainIdEnv = /* process.env.NEXT_PUBLIC_DEPLOY_ENV === 'docker' ? 31337 : */ chainId;
    return {
      library: provider,
      kycLibrary: wcProvider,
      account,
      active,
      activate,
      chainId: chainIdEnv,
      deactivate,
      error,
      safe: connector?.provider?.safe,
    };
  }
};

export default useWeb3;
