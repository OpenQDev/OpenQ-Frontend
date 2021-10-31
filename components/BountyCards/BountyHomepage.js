import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from 'ethers';
import useTrait from "../../services/utils/hooks/useTrait";
import addresses from "../../addresses/addresses.json";
import { useWeb3React } from '@web3-react/core';

const BountyHomepage = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds] = useState([]);
  const [issueIdToAddress, setIssueIdToAddress] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [fundingData, setFundingData] = useState({});
  const [tokenAddresses, setTokenAddresses] = useState([addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS]);

  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

  const [isLoading, setIsLoading] = useState(true);
  console.log(appState.openQAddress);
  async function populateBountyData() {
    setIsLoading(true);

    const issues = await appState.openQClient.getAllIssues(library);
    setIssueIds(issues);

    const issueIdToAddresses = await appState.openQClient.getIssueAddresses(library, issues);
    setIssueIdToAddress(issueIdToAddresses);

    const issueData = await appState.githubRepository.getIssueData(issues);
    setIssueData(issueData);

    const fundingDataObject = await appState.openQClient.getIssueDeposits(tokenAddresses, library, issueIdToAddresses);
    setFundingData(fundingDataObject);
    setIsLoading(false);
  }

  useEffect(() => {
    if (active) {
      populateBountyData();
    }
  }, [active]);

  if (isLoading) {
    return "Loading...";
  } else {
    return (
      <div className="grid grid-cols-3 gap-6 pr-20">
        {issueData.map((issue) => {
          return <BountyCard
            repoName={issue.repoName}
            issueName={issue.title}
            avatarUrl={issue.avatarUrl}
            labels={issue.labels}
            address={issueIdToAddress[issue.issueId]}
            deposits={fundingData[issue.issueId]}
            key={issue.issueId} />;
        })}
      </div>
    );
  }
};

export default BountyHomepage;
