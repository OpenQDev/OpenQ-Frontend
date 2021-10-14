import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from "ethers";

const ConnectWallet = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [isConnected, setIsConnected] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);

  const isMetaMaskConnected = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  };

  useEffect(() => {
    async function checkIsConnected() {
      const mm = await isMetaMaskConnected();
      console.log(mm);
      setIsConnected(mm);
    }
    checkIsConnected();
  }, []);

  const hasMetamask = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const requestAccounts = async () => {
    setIsDeciding(true);
    const hasMetamask = checkForMetamask();
    const address = await window.ethereum.request({ method: "eth_requestAccounts" });
    dispatch({ type: "UPDATE_ADDRESS", payload: address[0] });
    setIsConnected(true);
    console.log(appState.publicAddress);
  };

  return (
    <div>
      {(isConnected && !isDeciding) ? null : <button
        onClick={requestAccounts}
        className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
      >
        Connect Wallet
      </button>}
    </div>
  );
};

export default ConnectWallet;
