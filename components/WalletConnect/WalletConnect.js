import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';
import InstallButton from "./InstallButton";
import ConnectButton from "./ConnectButton";
import ChainConnectionContext from "../../store/ChainConnectionStore/ChainConnectionContext";

const WalletConnect = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [connectionState, dispatch] = useContext(ChainConnectionContext);

  const metaMaskClientCheck = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  useEffect(() => {
    dispatch({ type: "HAS_METAMASK", payload: metaMaskClientCheck() });
  }, []);

  console.log(connectionState);

  if (connectionState.showWalletConnect) {
    return connectionState.hasMetamask ? <ConnectButton /> : <InstallButton />;
  } else {
    return null;
  }
};

export default WalletConnect;
