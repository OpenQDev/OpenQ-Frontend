// Third party
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
// web3-react fails to report ANY chainId if it is not included in the supportedChainIds array - so we add most common networks here... :-P

export const injected = new InjectedConnector({
  supportedChainIds: [1, 2, 3, 4, 5, 42, 10, 80001, 137, 31337, 137, 56, 97, 100, 61, 62, 63],
});
export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [137],
  rpc: {
    137: process.env.POLYGON_PROVIDER_URL,
  },
  qrcode: true,
});
