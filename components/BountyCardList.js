import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';

const BountyCardList = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds]  = useState([])
  const [issueIdToAddress, setIssueIdToAddress]  = useState({})

  const bountyData = [
    {repoName: "uniswap/uniswap", issueName: "Issue name"},
    {repoName: "uniswap/uniswap2", issueName: "Issue name2"},
  ]

  async function getAllIssues() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      try {
        const allIssueIds = await contract.getIssueIds();
        return allIssueIds
      } catch (err) {
        console.log("getAllIssues Error: ", err);
      }
    }
  }

  async function getIssueAddresses(issues) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      const issueIdToAddress = {}
      try {
        for(const issueId of issues) {
          const issueAddress = await contract.issueToAddress(issueId);
          issueIdToAddress[issueId] = issueAddress
        }
        return issueIdToAddress
      } catch (err) {
        console.log("getIssueAddresses Error: ", err);
      }
    }
  }

  useEffect(() =>{
    async function populateBountyData() {
      const issues = await getAllIssues()
      setIssueIds(issues)

      const issueIdToAddresses = await getIssueAddresses(issues)
      setIssueIdToAddress(issueIdToAddress)
      
      console.log(issueIdToAddresses)
    }
    populateBountyData()
  }, [])

  return (
    <div className="grid grid-cols-3 gap-6 pr-20">
      {bountyData.map((bounty, index) => {
        return <BountyCard repoName={bounty.repoName} issueName={bounty.issueName} key={index}/>
      })}
    </div>
  );
};

export default BountyCardList;
