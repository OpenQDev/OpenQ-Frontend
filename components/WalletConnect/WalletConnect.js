import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';
import InstallButton from "./InstallButton";
import ConnectButton from "./ConnectButton";

const WalletConnect = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [showButton, setShowButton] = useState(true);

  //Created check function to see if the MetaMask extension is installed
  const metaMaskClientCheck = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', function (networkId) {
      checkAccounts();
    });
    // First see if MetaMask is installed
    setIsMetaMaskInstalled(metaMaskClientCheck());

    // Then if it is, see 
    // to determine whether or not to show the button at all
    checkAccounts();
  }, []);

  const checkAccounts = () => {
    if (window.ethereum.selectedAddress !== null) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  };

  return (
    <>
      {showButton ? isMetaMaskInstalled ? <ConnectButton /> : <InstallButton /> : null}
    </>
  );
};

export default WalletConnect;
