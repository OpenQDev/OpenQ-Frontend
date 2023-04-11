import React from 'react';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../hooks/useWeb3';
import ConnectButton from '../WalletConnect/ConnectButton';

const OnlyIfAccountPresent = ({ children }) => {
  const { account } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  if (account && isOnCorrectNetwork) return children;
  return <ConnectButton />;
};
export default OnlyIfAccountPresent;
