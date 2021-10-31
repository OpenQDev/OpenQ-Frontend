import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { useWeb3React } from '@web3-react/core';
import process from "process";

const BountyHomepage = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds] = useState([]);
  const [issueIdToAddress, setIssueIdToAddress] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [fundingData, setFundingData] = useState({});

  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

  const [isLoading, setIsLoading] = useState(true);

  async function populateBountyData() {
    setIsLoading(true);

    const issues = await appState.openQClient.getAllIssues(library, process.env.OPENQ_ADDRESS);
    setIssueIds(issues);

    const issueIdToAddresses = await appState.openQClient.getIssueAddresses(library, issues, process.env.OPENQ_ADDRESS);
    setIssueIdToAddress(issueIdToAddresses);

    const issueData = await appState.githubRepository.getIssueData(issues);
    setIssueData(issueData);

    const fundingDataObject = await appState.openQClient.getIssueDeposits(library, issueIdToAddresses, process.env.OPENQ_ADDRESS);
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
