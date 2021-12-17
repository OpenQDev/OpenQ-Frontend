// Third Party
import React, { useState, useEffect, useContext, useRef } from "react";
import TokenFundBox from "./SearchTokens/TokenFundBox";
import useWeb3 from "../../hooks/useWeb3";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from "ethers";
import useConfirmErrorSuccessModals from "../../hooks/useConfirmErrorSuccessModals";
import ConfirmErrorSuccessModalsTrio from "../ConfirmErrorSuccessModals/ConfirmErrorSuccessModalsTrio";
import ButtonLoadingIcon from "../Loading/ButtonLoadingIcon";

const FundModal = ({ showModal, setShowModal, bounty }) => {
  // State
  const [token, setToken] = useState({
    name: "Mock Link",
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    symbol: "mLink",
    decimals: 18,
    chainId: 80001,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
  });
  const [volume, setVolume] = useState("");
  const {
    showErrorModal,
    setShowErrorModal,
    showSuccessModal,
    setShowSuccessModal,
    showConfirmationModal,
    setShowConfirmationModal,
  } = useConfirmErrorSuccessModals();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  let menuRef = useRef();
  let notifyMenuRef;

  // Context
  const [appState] = useContext(StoreContext);
  const { library } = useWeb3();

  // Methods
  async function fundBounty() {
    setIsLoading(true);
    const volumeInWei = volume * 10 ** token.decimals;
    const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toString());

    let approveSucceeded = false;
    try {
      await appState.openQClient.approve(
        library,
        bounty.bountyAddress,
        token.address,
        bigNumberVolumeInWei
      );
      approveSucceeded = true;
    } catch (error) {
      setTransactionHash(JSON.stringify(error));
      setErrorMessage(JSON.stringify(error));
      setIsLoading(false);
      setShowErrorModal(true);
    }

    if (approveSucceeded) {
      console.log(bounty);
      try {
        const fundTxnReceipt = await appState.openQClient.fundBounty(
          library,
          bounty.bountyAddress,
          token.address,
          bigNumberVolumeInWei
        );
        setTransactionHash(fundTxnReceipt.transactionHash);
        setSuccessMessage(
          `Successfully funded issue ${bounty.url} with ${volume} ${token.symbol}!`
        );
        setShowSuccessModal(true);
        setIsLoading(false);
      } catch (error) {
        setTransactionHash(JSON.stringify(error));
        setErrorMessage(JSON.stringify(error));
        setIsLoading(false);
        setShowErrorModal(true);
      }
    }
  }

  const updateModal = () => {
    setShowModal(false);
  };

  function onCurrencySelect(token) {
    setToken(token);
    setConfirmationMessage(
      `You are about to fund this bounty at address ${bounty.bountyAddress.substring(
        0,
        12
      )}...${bounty.bountyAddress.substring(32)} with ${volume} ${
        token.name
      }. Is this correct?`
    );
  }

  function onVolumeChange(volume) {
    setVolume(volume);
    setConfirmationMessage(
      `You are about to fund this bounty at address ${bounty.bountyAddress.substring(
        0,
        12
      )}...${bounty.bountyAddress.substring(32)} with ${volume} ${
        token.name
      }. Is this correct?`
    );
  }

  const notificationRef = (data) => {
    notifyMenuRef = data;
  };

  //Close Modal on outside click
  /* useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        if (!isLoading) {
          if (!notifyMenuRef.current.contains(event.target)) {
            setIsLoading(false);
            updateModal();
          }
        } else {
          updateModal();
        }
      }
    };
    window.addEventListener("mousedown", handler);

    return () => {
      window.removeEventListener("mousedown", handler);
    };
  }); */

  // Render
  return (
    <div>
      <div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-1/4 my-6 mx-auto max-w-3xl">
          <div
            ref={menuRef}
            className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none"
          >
            <div className="flex flex-col p-5 items-center justify-center border-solid border-blueGray-200 rounded-t">
              <div className="text-3xl font-semibold">Fund Bounty </div>
              <div className="text-lg pt-3 font-mont text-center text-gray-400">
                Deposited ERC-20 Tokens can be withdrawn again after 30 days
              </div>
            </div>
            <div className="p-7 flex-auto">
              <TokenFundBox
                onCurrencySelect={onCurrencySelect}
                onVolumeChange={onVolumeChange}
                token={token}
                volume={volume}
              />
            </div>
            <div className="flex px-6 pb-7">
              <button
                className={`flex flex-row justify-center space-x-5 items-center py-3 text-lg text-white ${
                  isLoading
                    ? "confirm-btn-disabled cursor-not-allowed"
                    : "confirm-btn cursor-pointer"
                }`}
                type="button"
                onClick={() => setShowConfirmationModal(true)}
              >
                <div>{!isLoading ? "Fund" : "Approving"}</div>
                <div>{isLoading && <ButtonLoadingIcon />}</div>
              </button>
            </div>
            {/*  <div className="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => updateModal()}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>

      <ConfirmErrorSuccessModalsTrio
        setShowErrorModal={setShowErrorModal}
        notificationRef={notificationRef}
        showErrorModal={showErrorModal}
        errorMessage={errorMessage}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
        confirmationTitle={"Confirm Deposit"}
        confirmationMessage={confirmationMessage}
        positiveOption={"Approve"}
        confirmMethod={fundBounty}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMessage={successMessage}
        transactionHash={transactionHash}
      />
    </div>
  );
};

export default FundModal;
