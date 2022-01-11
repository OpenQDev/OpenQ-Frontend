// Third Party
import React, { useState, useEffect } from "react";
// Custom
import useWeb3 from "../../hooks/useWeb3";
import { injected } from "./connectors";
import useConnectOnLoad from "../../hooks/useConnectOnLoad";
import chainIdDeployEnvMap from "./chainIdDeployEnvMap";

const ConnectButton = () => {
  // State
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);

  // Context
  const { chainId, account, activate, active } = useWeb3();

  // Hooks
  useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

  useEffect(() => {
    if (active) {
      setIsHidden(true);
    }
  }, [active]);

  useEffect(() => {
    setIsOnCorrectNetwork(
      chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]["chainId"] ==
        chainId
    );
  }, [chainId]);

  // Methods
  const onClickConnect = async () => {
    setButtonText("Connecting...");
    setIsDisabled(true);

    await activate(injected);

    setIsDisabled(false);
    setIsHidden(true);
  };

  const addOrSwitchNetwork = () => {
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params:
          chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]["params"],
      })
      .catch((error) => console.log("Error", error.message));
  };

  // Render
  if (account && isOnCorrectNetwork) {
    const firstThree = account.slice(0, 5);
    const lastThree = account.slice(-3);
    return (
      <div>
        <button
          disabled={true}
          className="font-mont whitespace-nowrap rounded-lg border border-web-gray py-2 px-6 text-white font-semibold cursor-pointer hover:border-white"
        >
          {firstThree}...{lastThree}
        </button>
      </div>
    );
  } else if (account) {
    return (
      <div>
        <button
          onClick={addOrSwitchNetwork}
          className="font-mont whitespace-nowrap rounded-lg border border-web-gray py-2 px-6 text-white font-semibold cursor-pointer hover:border-white"
        >
          Use{" "}
          {
            chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV][
              "networkName"
            ]
          }{" "}
          Network
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          hidden={isHidden}
          disabled={isDisabled}
          onClick={onClickConnect}
          className="font-mont whitespace-nowrap rounded-lg border border-web-gray py-2 px-6 text-white font-semibold cursor-pointer hover:border-white"
        >
          {buttonText}
        </button>
      </div>
    );
  }
};

export default ConnectButton;
