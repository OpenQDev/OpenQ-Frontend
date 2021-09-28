import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import OpenQ from '../artifacts/contracts/OpenQ.sol/OpenQ.json';
import { ethers } from 'ethers';

function Claim() {
    const [appState, setAppState] = useContext(StoreContext);
    const [issueUrl, setIssueUrl] = useState("https://github.com/OpenQDev/frontend/issues/3");

    const openQAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function claimBounty(event) {
        event.preventDefault();
        const issueUrl = event.target.value;
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const payoutAddress = await signer.getAddress();
            const contract = new ethers.Contract(openQAddress, OpenQ.abi, signer);
            try {
                let pathArray = appState.utils.parseGitHubUrl(issueUrl);
                const [orgName, repoName, issueId] = pathArray;
                const globalIssueId = await appState.githubRepository.fetchIssue(orgName, repoName, issueId);
                const transaction = await contract.claimBounty(globalIssueId, payoutAddress);
                await transaction.wait();
            } catch (error) {
                console.log("claimBounty error:", error);
            }
        }
    }

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
                <button type="submit">Claim Bounty</button>
            </form>
        </div>
    );
}

export default Claim;
