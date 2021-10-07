import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';

/***
 * This is used for a future in which we directly call the OpenQ contract to withdraw and use an orcale
 * 
 */
function Claim() {
    const [appState, setAppState] = useContext(StoreContext);
    const [issueUrl, setIssueUrl] = useState("https://github.com/OpenQDev/frontend/issues/3");

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function claimBounty(event) {
        event.preventDefault();
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = appState.openQClient.OpenQ(process.env.OPENQ_ADDRESS, signer);
            const payoutAddress = await signer.getAddress();
            try {
                let pathArray = appState.utils.parseGitHubUrl(issueUrl);
                const [orgName, repoName, issueId] = pathArray;
                const resp = await appState.githubRepository.fetchIssue(orgName, repoName, issueId);
                const globalIssueId = resp.data.organization.repository.issue.id;
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
