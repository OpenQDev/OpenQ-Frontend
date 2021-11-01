import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';
import {
    injected
} from './connectors';

import useEagerConnect from "../../hooks/useEagerConnect";

const ConnectButton = () => {
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

    const [buttonText, setButtonText] = useState("Connect Wallet");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);

    useEagerConnect();

    const chainIdDeployEnvMap = {
        "docker": 31337,
        "development": 80001,
        "staging": 137,
        "production": 137
    };

    useEffect(() => {
        if (active) {
            setIsHidden(true);
        }
    }, [active]);

    useEffect(() => {
        setIsOnCorrectNetwork(chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV] == chainId);
    }, [chainId]);

    const onClickConnect = async () => {
        setButtonText("Connecting...");
        setIsDisabled(true);
        await activate(injected);
        setIsDisabled(false);
        setIsHidden(true);
    };

    if (account && isOnCorrectNetwork) {
        const firstThree = account.slice(0, 5);
        const lastThree = account.slice(-3);
        return (
            <button
                disabled={true}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >{firstThree}...{lastThree}</button>
        );
    } else if (account) {
        return (
            <div>Switch Networks</div>
        );
    } else {
        return (
            <button
                hidden={isHidden}
                disabled={isDisabled}
                onClick={onClickConnect}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >
                {buttonText}
            </button>
        );
    }
};

export default ConnectButton;