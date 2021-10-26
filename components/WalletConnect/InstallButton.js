import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';
import ChainConnectionContext from "../../store/ChainConnectionStore/ChainConnectionContext";

const InstallButton = () => {
    const [buttonText, setButtonText] = useState("Install MetaMask!");
    const [isDisabled, setIsDisabled] = useState(false);
    const [connectionState, dispatch] = useContext(ChainConnectionContext);

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

export default InstallButton;