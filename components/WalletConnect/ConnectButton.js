import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import { Web3Provider } from '@ethersproject/providers';
import {
    injected
} from './connectors';

import useEagerConnect from "../../hooks/useEagerConnect";

const ConnectButton = () => {
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

    const [buttonText, setButtonText] = useState("Connect Wallet");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEagerConnect();

    useEffect(() => {
        if (active) {
            setIsHidden(true);
        }
    }, [active]);

    const onClickConnect = async () => {
        setButtonText("Connecting...");
        setIsDisabled(true);
        await activate(injected);
        setIsDisabled(false);
        setIsHidden(true);
    };

    if (account) {
        const firstThree = account.slice(0, 5);
        const lastThree = account.slice(-3);
        return (
            <button
                disabled={true}
                className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
            >{firstThree}...{lastThree}</button>
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