import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from 'ethers';
import useTrait from "../../services/utils/hooks/useTrait";
import addresses from "../../addresses/addresses.json";
import { useWeb3React } from '@web3-react/core';

const BountyCardList = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds] = useState([]);
  const [issueIdToAddress, setIssueIdToAddress] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [fundingData, setFundingData] = useState({});
  const [tokenAddresses, setTokenAddresses] = useState([addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS]);

  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

  const provider = useTrait(null);
  const signer = useTrait(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(active);
  }, [active]);

  async function populateBountyData() {
    setIsLoading(true);

    const issues = await appState.openQClient.getAllIssues(signer.get());
    setIssueIds(issues);

    const issueIdToAddresses = await appState.openQClient.getIssueAddresses(signer.get(), issues);
    setIssueIdToAddress(issueIdToAddresses);

    const issueData = await appState.githubRepository.getIssueData(issues);
    setIssueData(issueData);

    const fundingDataObject = await appState.openQClient.getIssueDeposits(tokenAddresses, signer.get(), issueIdToAddresses);
    setFundingData(fundingDataObject);

    setIsLoading(false);
  }

  const Loading = () => {
    return (<div>Loading...</div>);
  };

  const BountyList = () => {
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
  };

  const MustConnect = () => {
    return (<div>Must connect wallet to load boutnies.</div>);
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return <BountyCardList />;
  }

};

export default BountyCardList;
