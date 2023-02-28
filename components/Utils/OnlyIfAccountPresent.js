import React from 'react';
import useWeb3 from '../../hooks/useWeb3';
import ConnectButton from '../WalletConnect/ConnectButton';

const OnlyIfAccountPresent = ({ children }) => {
  const { account } = useWeb3();
  if (account) return children;
  return <ConnectButton />;
};
export default OnlyIfAccountPresent;
