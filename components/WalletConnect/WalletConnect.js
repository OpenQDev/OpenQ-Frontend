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

  const hasAConnectedMetaMask = Boolean(connectionState.hasMetamask && connectionState.activeAccount);
  const doesNotHaveMetaMask = !connectionState.hasMetamask;

  if (!connectionState.hasMetamask) {
    return <InstallButton />;
  } else if (connectionState.activeAccount === null) {
    return <ConnectButton />;
  } else {
    return null;
  }
};

export default WalletConnect;
