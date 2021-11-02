import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { useWeb3React } from '@web3-react/core';
import chainIdDeployEnvMap from "../WalletConnect/chainIdDeployEnvMap";

const BountyHomepage = () => {
  // State
  const [issueIds, setIssueIds] = useState([]);
  const [issueIdToAddress, setIssueIdToAddress] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [fundingData, setFundingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Context
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();
  const [appState, dispatch] = useContext(StoreContext);

  // Hooks
  useEffect(() => {
    const isOnCorrectNetwork = chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]["chainId"] == chainId;
    if (active && isOnCorrectNetwork) {
      populateBountyData();
    } else {
      setIsLoading(true);
    }
  }, [active, chainId]);

  // Methods

  /**
   * 
   */
  async function populateBountyData() {
    setIsLoading(true);

    const issues = await appState.openQClient.getAllIssues(library);
    setIssueIds(issues);

    const issueIdToAddresses = await appState.openQClient.getIssueAddresses(library, issues);
    setIssueIdToAddress(issueIdToAddresses);

    const issueData = await appState.githubRepository.getIssueData(issues);
    setIssueData(issueData);

    const fundingDataObject = await appState.openQClient.getIssueDeposits(library, issueIdToAddresses);
    setFundingData(fundingDataObject);
    setIsLoading(false);
  }

  // Render
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
