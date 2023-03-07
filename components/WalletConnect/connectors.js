import { WalletConnect } from '@web3-react/walletconnect-v2';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { GnosisSafe } from '@web3-react/gnosis-safe';

export const [walletConnect, walletConnectHooks] = initializeConnector(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        projectId: 'a6cc11517a10f6f12953fd67b1eb67e7',
        rpc: {
          137: [
            `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
            'https://polygon-rpc.com',
          ],
        },
      },
    })
);
function onError(error) {
  console.debug(`web3-react error: ${error}`);
}
export const [metaMask, metaMaskHooks] = initializeConnector((actions) => new MetaMask({ actions, onError }));

export const [gnosisSafe, gnosisSafeHooks] = initializeConnector((actions) => new GnosisSafe({ actions }));
