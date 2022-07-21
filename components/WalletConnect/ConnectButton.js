// Third party
import React, { useState, useEffect, useRef, useContext } from "react";
import jazzicon from "@metamask/jazzicon";
// Custom
import useWeb3 from "../../hooks/useWeb3";
import useConnectOnLoad from "../../hooks/useConnectOnLoad";
import chainIdDeployEnvMap from "./chainIdDeployEnvMap";
import AccountModal from "./AccountModal";
import ConnectModal from "./ConnectModal";
import useEns from "../../hooks/useENS";
import useIsOnCorrectNetwork from "../../hooks/useIsOnCorrectNetwork";
import StoreContext from "../../store/Store/StoreContext";
// import axios from 'axios';

const ConnectButton = () => {
  // Context
  const { chainId, error, account, deactivate, safe } = useWeb3();
  const [ensName] = useEns(account);
  const [appState, dispatch] = useContext(StoreContext);
  const { walletConnectModal } = appState;

  // State
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork({
    chainId: chainId,
    error: error,
    account: account,
  });
  const [showModal, setShowModal] = useState();
  const iconWrapper = useRef();
  const modalRef = useRef();
  const buttonRef = useRef();

  // Hooks
  useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

  useEffect(async () => {
    if (account && iconWrapper.current) {
      iconWrapper.current.innerHTML = "";
      iconWrapper.current.appendChild(
        jazzicon(24, parseInt(account.slice(2, 10), 16))
      );
    }
  }, [account, isOnCorrectNetwork]);

  useEffect(() => {
    let handler = (event) => {
      if (
        !modalRef.current?.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setShowModal(false);
      }
    };
    window.addEventListener("mousedown", handler);

    return () => {
      window.removeEventListener("mousedown", handler);
    };
  });

  // Methods
  const openConnectModal = async () => {
    const payload = {
      type: "CONNECT_WALLET",
      payload: true,
    };
    dispatch(payload);
  };

  const closeModal = () => {
    const payload = {
      type: "CONNECT_WALLET",
      payload: false,
    };
    dispatch(payload);
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
  return (
    <div>
      {account && isOnCorrectNetwork ? (
        <div>
          <button
            disabled={isConnecting}
            ref={buttonRef}
            onClick={() => {
              setShowModal(!showModal);
            }}
            className="group flex items-center gap-x-1 h-12 whitespace-nowrap  py-1 px-3  font-semibold cursor-pointer hover:border-active-accent"
          >
            <span
              className="border-2 border-inactive-accent rounded-full h-7 py-pxt group-hover:bg-active-accent group-hover:border-active-accent"
              ref={iconWrapper}
            ></span>
            <span className="py">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          {showModal && (
            <AccountModal
              domRef={modalRef}
              account={account}
              ensName={ensName}
              chainId={chainId}
              deactivate={deactivate}
              setIsConnecting={setIsConnecting}
              isSafeApp={safe}
            />
          )}
        </div>
      ) : isOnCorrectNetwork ? (
        <div>
          <button
            onClick={openConnectModal}
            className="flex items-center btn-default whitespace-nowrap px-3 py-2 mr-2 hover:border-[#8b949e] hover:bg-[#30363d]"
            disabled={isConnecting}
          >
            {"Connect Wallet"}
          </button>
        </div>
      ) : (
        <button
          onClick={addOrSwitchNetwork}
          className="flex items-center btn-default whitespace-nowrap px-3 py-2 mr-2 hover:border-[#8b949e] hover:bg-[#30363d]"
        >
          Use{" "}
          {
            chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV][
              "networkName"
            ]
          }{" "}
          Network
        </button>
      )}
      {walletConnectModal && <ConnectModal closeModal={closeModal} />}
    </div>
  );
};

export default ConnectButton;
