import React, { useState, useContext, useEffect } from "react";
import ChainConnectionContext from "../../store/ChainConnectionStore/ChainConnectionContext";

const ConnectButton = () => {
    const [buttonText, setButtonText] = useState("Connect Wallet");
    const [isDisabled, setIsDisabled] = useState(false);
    const [connectionState, dispatch] = useContext(ChainConnectionContext);

    const onClickConnect = async () => {
        try {
            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            setButtonText("Connecting...");
            setIsDisabled(true);
            const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' });
            setIsDisabled(false);
            dispatch({ type: "ACTIVE_ACCOUNT", payload: { activeAccount: accounts[0] } });
        } catch (error) {
            console.error(error);
            dispatch({ type: "ACTIVE_ACCOUNT", payload: { activeAccount: "null" } });

            setIsDisabled(false);
            setButtonText("Connect Wallet");
        }
    };

    const checkAccounts = () => {
        if (window.ethereum?.selectedAddress !== null) {
            console.log("checking accounts");
            dispatch({ type: "ACTIVE_ACCOUNT", payload: window.ethereum?.selectedAddress });
        } else {
            dispatch({ type: "ACTIVE_ACCOUNT", payload: null });
        }
    };

    useEffect(() => {
        window.ethereum?.on('accountsChanged', function (networkId) {
            checkAccounts();
        });

        checkAccounts();
    }, []);

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

export default ConnectButton;