import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';

const ConnectWallet = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [showButton, setShowButton] = useState(true);

  //Created check function to see if the MetaMask extension is installed
  const metaMaskClientCheck = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const ConnectButton = () => {
    const [buttonText, setButtonText] = useState("Connect Wallet");
    const [isDisabled, setIsDisabled] = useState(false);

    const onClickConnect = async () => {
      try {
        // Will open the MetaMask UI
        // You should disable this button while the request is pending!
        setButtonText("Connecting...");
        setIsDisabled(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(window.ethereum);
        console.log(accounts);
        setIsDisabled(false);
        setShowButton(false);
      } catch (error) {
        console.error(error);
        setIsDisabled(false);
        setButtonText("Connect Wallet");
      }
    };

    return (
      <button
        disabled={isDisabled}
        onClick={onClickConnect}
        className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
      >
        {buttonText}
      </button>
    );
  };

  const InstallButton = () => {
    const [buttonText, setButtonText] = useState("Install MetaMask!");
    const [isDisabled, setIsDisabled] = useState(false);

    //This will start the onboarding proccess
    const onClickInstall = () => {
      //We create a new MetaMask onboarding object to use in our app
      const onboarding = new MetaMaskOnboarding({ forwarderOrigin: "http://localhost:3000" });
      setButtonText('Onboarding in progress');
      //On this object we have startOnboarding which will start the onboarding process for our end user
      setIsDisabled(true);
      onboarding.startOnboarding();
    };

    return (
      <button
        disabled={isDisabled}
        onClick={onClickInstall}
        className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
      >
        {buttonText}
      </button>
    );
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

export default ConnectWallet;
