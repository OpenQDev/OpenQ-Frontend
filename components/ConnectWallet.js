import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from "ethers";

const ConnectWallet = () => {
  const [state, dispatch] = useContext(StoreContext);
  const [userName, setUsername] = useState("");
  const [stateManager, setStateManager] = useState(true);

  useEffect(() => {
    if (userName && stateManager) {
      console.log("updating to: ", userName);
      dispatch({ type: "UPDATE_NAME", payload: userName });

      //Connect to Metamask
      window.ethereum.request({ method: "eth_requestAccounts" });
      setStateManager(false);
    }
  });

  useEffect(() => {
    if (!stateManager) {
      console.log(state);
    }
  });

  const updateConnection = () => {
    console.log("update Requested...");
    console.log(state);
    setUsername("BOBBY");
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
