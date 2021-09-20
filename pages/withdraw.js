import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/AuthStore/AuthContext";

function Withdraw() {
    const [issueUrl, setIssueUrl] = useState("");
    const [authState, setAuthState] = useContext(AuthContext);

    const withdrawBounty = (event) => {
        event.preventDefault();
        console.log(issueUrl);
        const token = window.localStorage.getItem('token');
        axios.post(`http://localhost:8090/withdraw`, {
            username: "alo9507",
            issueId: "I_kwDOGAqhQc47ptzS",
            payoutAddress: "0xDf9aF175CE0BB59bcAC9CbD965Cd46cfd9806277",
            oauthToken: token
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="font-mont bg-gray-100 font-normal text-gray-600">
            <form onSubmit={(event) => withdrawBounty(event)}>
                <input
                    className="bg-gray-100 w-6/7 border-gray-100 outline-none"
                    id="name"
                    placeholder="https://github.com/OpenQDev/frontend/issues/3"
                    type="text"
                    onChange={(event) => setIssueUrl(event.target.value)}
                />
                <button type="submit">Withdraw</button>
            </form>
            <div>
                {issueUrl}
            </div>
        </div>
    );
}

export default Withdraw;
