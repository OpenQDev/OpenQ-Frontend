import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/AuthStore/AuthContext";
import StoreContext from "../store/Store/StoreContext";

function Withdraw() {
    const [issueUrl, setIssueUrl] = useState("https://github.com/OpenQDev/OpenQ-Contracts/issues/48");
    const [authState, setAuthState] = useContext(AuthContext);
    const [appState, setAppState] = useContext(StoreContext);

    const withdrawBounty = async (event) => {
        event.preventDefault();
        let pathArray = appState.utils.parseGitHubUrl(issueUrl);
        const [orgName, repoName, issueId] = pathArray;

        const issueResponse = await appState.githubRepository.fetchIssue(orgName, repoName, issueId);
        const globalIssueId = issueResponse.data.organization.repository.issue.id;

        const userResponse = await appState.githubRepository.fetchAvatarUrl();
        const username = userResponse.data.viewer.login;

        const token = window.localStorage.getItem('token');

        axios.post(`${appState.baseUrl}${appState.apiPort}/withdraw`, {
            issueId: globalIssueId,
            payoutAddress: window.ethereum.selectedAddress,
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
                    value={issueUrl}
                    onChange={(event) => setIssueUrl(event.target.value)}
                />
                <button type="submit">Withdraw</button>
            </form>
        </div>
    );
}

export default Withdraw;
