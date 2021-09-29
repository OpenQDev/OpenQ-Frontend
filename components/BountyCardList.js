import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';

const BountyCardList = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds]  = useState([])

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
        setIssueIds(issueIds)
      } catch (err) {
        console.log("getAllIssues Error: ", err);
      }
    }
  }

  async function getIssueAddresses() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      try {
        issueIds.foreach(async (issueId) => {
          const issueAddress = await contract.issueToAddress(issueId);
          issueIdToAddress[issueId] = issueAddress
        })
        console.log(JSON.stringify(issueIdToAddress))
      } catch (err) {
        console.log("getIssueAddresses Error: ", err);
      }
    }
  }

  // async function getIssueAddresses() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
  //     try {
  //       for (entry in issueToAddress) {
  //         appState.tokenAddresses.forEach(tokenAddress => {
  //           const issueAddress = await contract.issueToAddress(issueId);
  //         });
  //       }
  //     } catch (err) {
  //       console.log("getIssueAddresses Error: ", err);
  //     }
  //   }
  // }

  useEffect(() =>{
    async function populateBountyData() {
      await getAllIssues()
      await getIssueAddresses()
      // await getIssueBalances()
    }
    populateBountyData
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
