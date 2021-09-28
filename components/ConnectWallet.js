import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from "ethers";

const ConnectWallet = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [metamask, setMetamask] = useState(false);

  const checkForMetamask = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);

  };

  useEffect(() => {
    if (!appState.publicAddress) {
      const getAccounts = async () => {
        const address = await window.ethereum.request({ method: "eth_requestAccounts" });
        dispatch({ type: "UPDATE_ADDRESS", payload: address[0] });
      };
      getAccounts();
    }
  });

  const updateConnection = () => {
    console.log(appState.publicAddress);
  };

  return (
    <div>
      <button
        onClick={() => updateConnection()}
        className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
