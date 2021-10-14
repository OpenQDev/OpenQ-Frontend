import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';

const ConnectWallet = () => {
  const [buttonText, setButtonText] = useState("");
  const [isDisabled, setIsDisabled] = useState("");
  const [onClickHandler, setOnClickHandler] = useState(() => () => console.log("default"));

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //------Inserted Code------\\
  const metaMaskClientCheck = () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      setButtonText('Click here to install MetaMask!');
      setOnClickHandler(() => () => onClickInstall());
      setIsDisabled(false);
    } else {
      //If it is installed we change our button text
      setButtonText('Connect Wallet');
    }
  };

  //This will start the onboarding proccess
  const onClickInstall = () => {
    //We create a new MetaMask onboarding object to use in our app
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin: "http://localhost:3000" });
    setButtonText('Onboarding in progress');
    setIsDisabled(true);
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  useEffect(() => {
    metaMaskClientCheck();
  }, []);

  return (
    <div><button
      disabled={isDisabled}
      onClick={onClickHandler}
      className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
    >
      {buttonText}
    </button>
    </div>
  );
};

export default ConnectWallet;
