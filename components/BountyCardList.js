import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';

const BountyCardList = () => {
  const [appState, dispatch] = useContext(StoreContext);

  const bountyData = [
    {repoName: "uniswap/uniswap", issueName: "Issue name"},
    {repoName: "uniswap/uniswap2", issueName: "Issue name2"},
  ]

  const issueIdToAddress = {}

  async function getAllIssues() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      try {
        const issueIds = await contract.getIssueIds();
        console.log(issueIds);
      } catch (err) {
        console.log("getAllIssues Error: ", err);
      }
    }
  }

  async function getBalanceOfBounty(tokenAddress, bountyAddress) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      try {
        const bountyAddress = await contract.getBountyAddress(id);
        return bountyAddress;
      } catch (err) {
        console.log("getBountyAddress Error: ", err);
      }
    }
  }

  useEffect(() =>{
    getAllIssues()
    // appState.tokenAddresses.forEach(tokenAddress => {
      
    // });
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
