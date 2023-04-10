import { WalletConnect } from '@web3-react/walletconnect-v2';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';

export const [walletConnect, walletConnectHooks] = initializeConnector(
  (actions) =>
    new WalletConnect({
      actions,
      defaultChainId: 137,
      options: {
        projectId: 'a6cc11517a10f6f12953fd67b1eb67e7',
        chains: [137],
      },
    })
);
function onError(error) {
  console.debug(`web3-react error: ${error}`);
}
export const [metaMask, metaMaskHooks] = initializeConnector((actions) => new MetaMask({ actions, onError }));

export const [coinbaseWallet, coinbaseHooks] = initializeConnector(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        projectId: 'a6cc11517a10f6f12953fd67b1eb67e7',
        chains: [137],
        appName: 'OpenQ',
      },
    })
);
