// Third Party
import React, { useState, useEffect } from "react";
import Image from "next/image";
// Custom
import useWeb3 from "../../hooks/useWeb3";
import { injected } from "./connectors";
import useConnectOnLoad from "../../hooks/useConnectOnLoad";
import chainIdDeployEnvMap from "./chainIdDeployEnvMap";

const MobileConnectButton = ({ mobile }) => {
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
        <button disabled={true}>
          <Image
            src="/diverse/metamask.png"
            alt="Wallet"
            width={25}
            height={25}
          />
        </button>
      </div>
    );
  } else if (account) {
    return (
      <div>
        <button onClick={addOrSwitchNetwork}>
          <Image
            src="/diverse/metamask.png"
            alt="Wallet"
            width={25}
            height={25}
          />
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
        >
          <Image
            src="/diverse/metamask.png"
            alt="Wallet"
            width={25}
            height={25}
          />
        </button>
      </div>
    );
  }
};

export default MobileConnectButton;
