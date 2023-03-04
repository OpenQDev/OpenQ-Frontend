import { WalletConnect } from '@web3-react/walletconnect';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import UAuth from '@uauth/js';
import { UAuthConnector } from '@uauth/web3-react';

export const [walletConnect, walletConnectHooks] = initializeConnector(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
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