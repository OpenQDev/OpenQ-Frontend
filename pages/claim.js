import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import StoreContext from "../store/Store/StoreContext";
import useAuth from "../hooks/useAuth";
import { useWeb3React } from '@web3-react/core';
import ErrorModal from "../components/ErrorModal";

function Claim() {
    const [issueUrl, setIssueUrl] = useState("https://github.com/OpenQDev/OpenQ-Contracts/issues/48");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [appState, setAppState] = useContext(StoreContext);
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

    useAuth();

    const claimBounty = async (event) => {
        event.preventDefault();
        axios.post(`${appState.oracleBaseUrl}/claim`, {
            issueUrl,
            payoutAddress: account
        }, { withCredentials: true })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message);
                setShowModal(true);
            });
    };

    return (
        <div className="font-mont bg-gray-100 font-normal text-gray-600">
            <form onSubmit={(event) => claimBounty(event)}>
                <input
                    className="bg-gray-100 w-6/7 border-gray-100 outline-none"
                    id="name"
                    placeholder="https://github.com/OpenQDev/frontend/issues/3"
                    type="text"
                    value={issueUrl}
                    onChange={(event) => setIssueUrl(event.target.value)}
                />
                <button
                    type="submit"
                    className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
                >
                    Claim
                </button>
            </form>
            {showModal && <ErrorModal modalVisibility={setShowModal} message={errorMessage} />}
        </div>
    );
}

export default Claim;
