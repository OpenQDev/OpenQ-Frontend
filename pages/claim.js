// Third Party Libraries
import React, { useState, useContext } from "react";
import axios from "axios";
import Image from "next/image";

// Custom
import StoreContext from "../store/Store/StoreContext";
import useAuth from "../hooks/useAuth";
import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";
import LoadingIcon from "../components/LoadingIcon";
import AuthButton from "../components/Authentication/AuthButton";
import ConfirmClaimModal from "../components/ConfirmClaimModal";
import useWeb3 from "../hooks/useWeb3";

function Claim() {
  // State
  const [issueUrl, setIssueUrl] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);

  // Context
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();

  // Hooks
  const [authState] = useAuth();

  // Methods
  const claimBounty = async () => {
    setIsLoading(true);
    axios
      .post(
        `${appState.oracleBaseUrl}/claim`,
        {
          issueUrl,
          payoutAddress: account,
        },
        { withCredentials: true }
      )
      .then((result) => {
        const { payoutAddress, transactionHash, issueUrl } = result.data;
        setIsLoading(false);
        setTransactionHash(transactionHash);
        setSuccessMessage(
          `Successfully transferred assets on issue with at ${issueUrl} to ${payoutAddress}!`
        );
        setShowSuccessModal(true);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.response.data.message);
        setShowErrorModal(true);
      });
  };

  // Render
  return (
    <div>
      <div className="flex items-end align-items-center justify-center">
        <div className="flex font-mont pt-7 justify-center items-center">
          <div className="flex flex-col">
            <div className="flex flex-col items-center text-gray-600">
              {!authState.isAuthenticated && (
                <div className="flex flex-row bg-purple-500 rounded-lg text-white p-3 w-72">
                  <div>
                    We noticed you are not signed into Github. You must sign to
                    verify and claim an issue!
                  </div>
                </div>
              )}
              <div className="flex flex-row space-x-4 pb-5 pt-5">
                {/*  <input
                  className="w-6/7 border-gray-200 outline-none"
                  id="name"
                  placeholder="https://github.com/..."
                  type="text"
                  value={issueUrl}
                  onChange={(event) => setIssueUrl(event.target.value)}
                /> */}
                <div className="flex flex-row items-center p-2  rounded-lg py-1 text-base bg-gray-100 shadow-inner text-white">
                  <div className=" bg-gray-100 font-normal text-gray-600">
                    <input
                      className="bg-gray-100 pl-3 box-content xl:w-80 lg:w-64 md:w-44 sm:w-32 w-18 border-gray-100 outline-none"
                      id="name"
                      placeholder="ISSUE URL"
                      type="text"
                      value={issueUrl}
                      onChange={(event) => setIssueUrl(event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
                    onClick={() => setShowConfirmationModal(true)}
                  >
                    Claim
                  </button>
                </div>
              </div>

              <AuthButton />
              {isLoading && <LoadingIcon />}
            </div>
          </div>
        </div>
      </div>
      {showErrorModal && (
        <ErrorModal
          modalVisibility={setShowErrorModal}
          message={errorMessage}
        />
      )}
      {showConfirmationModal && (
        <ConfirmClaimModal
          modalVisibility={setShowConfirmationModal}
          address={account}
          claimBounty={claimBounty}
          issueUrl={issueUrl}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          modalVisibility={setShowSuccessModal}
          message={successMessage}
          transactionHash={transactionHash}
        />
      )}
    </div>
  );
}

export default Claim;
