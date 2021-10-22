import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/AuthStore/AuthContext";
import StoreContext from "../store/Store/StoreContext";

function Claim() {
    const [issueUrl, setIssueUrl] = useState("https://github.com/OpenQDev/OpenQ-Contracts/issues/48");
    const [authState, setAuthState] = useContext(AuthContext);
    const [appState, setAppState] = useContext(StoreContext);

    const claimBounty = async (event) => {
        event.preventDefault();

        const token = window.localStorage.getItem('token');

        axios.post(`${appState.baseUrl}${appState.apiPort}/withdraw`, {
            issueUrl,
            payoutAddress: window.ethereum.selectedAddress
        }, { withCredentials: true })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
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
                <button type="submit">Claim</button>
            </form>
        </div>
    );
}

export default Claim;
