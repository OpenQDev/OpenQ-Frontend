import { WalletConnect } from '@web3-react/walletconnect-v2';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import UAuth from '@uauth/js';
import { UAuthConnector } from '@uauth/web3-react';

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

export const [gnosisSafe, gnosisSafeHooks] = initializeConnector((actions) => new GnosisSafe({ actions }));

export const [uauth, uauthHooks] = initializeConnector(
  (actions) =>
    new UAuthConnector({
      actions,
      options: {
        clientID: '8491d48f-12c6-4930-9736-42f0b89e1188',
        redirectUri: 'https://openq.dev/',
        scope: 'openid wallet email profile:optional social:optional',
        connectors: { injected: metaMask, walletconnect: walletConnect },
      },
    })
);

 const connectors = {
  UAuth: uauth,
  MetaMask: metaMask,
  WalletConnect: walletConnect,
};