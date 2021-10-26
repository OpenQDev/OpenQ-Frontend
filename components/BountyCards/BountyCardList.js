import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../../store/Store/StoreContext";
import { ethers } from 'ethers';
import useTrait from "../../services/utils/hooks/useTrait";
import addresses from "../../addresses/addresses.json";

const BountyCardList = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds] = useState([]);
  const [issueIdToAddress, setIssueIdToAddress] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [fundingData, setFundingData] = useState({});
  const [tokenAddresses, setTokenAddresses] = useState([addresses.FAKE_TOKEN_ADDRESS, addresses.MOCK_TOKEN_ADDRESS]);
  const [networkName, setNetworkName] = useState('');

  const provider = useTrait(null);
  const signer = useTrait(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const isOnCorrectNetwork = useTrait(true);

  function setSignerAndProvider() {
    if (window.ethereum) {
      provider.set(new ethers.providers.Web3Provider(window.ethereum));
      signer.set(provider.get().getSigner());
    } else {
      return;
    }
  }

  useEffect(() => {
    setSignerAndProvider();

    if (window.ethereum?.selectedAddress !== null) {
      setIsConnected(true);
      checkNetwork();

      if (isOnCorrectNetwork.get() == true) {
        populateBountyData();
      }
    } else {
      setIsLoading(false);
      setIsConnected(false);
      return;
    }
  }, []);

  useEffect(() => {
    window.ethereum?.on('accountsChanged', function (networkId) {
      if (window.ethereum?.selectedAddress == null) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
        if (isOnCorrectNetwork.get() == true) {
          populateBountyData();
        }
      }
    });

    window.ethereum?.on('networkChanged', function (networkId) {
      checkNetwork();
    });
  }, []);

  function checkNetwork() {
    const chainId = window.ethereum?.networkVersion;

    switch (process.env.DEPLOY_ENV) {
      case "docker":
        setNetworkName("Localhost");
        if (chainId == '31337') {
          isOnCorrectNetwork.set(true);
          setIsLoading(false);
        } else {
          isOnCorrectNetwork.set(false);
          setIsLoading(false);
        }
        break;
      case "development":
        setNetworkName("Mumbai");
        if (chainId == '80001') {
          isOnCorrectNetwork.set(true);
          setIsLoading(false);
        } else {
          isOnCorrectNetwork.set(false);
          setIsLoading(false);
        }
        break;
      case "production":
        setNetworkName("Polygon");
        if (chainId == '137') {
          isOnCorrectNetwork.set(true);
          setIsLoading(false);
        } else {
          isOnCorrectNetwork.set(false);
          setIsLoading(false);
        }
        break;
      default:
        console.log("Error...");
        break;
    }
  }

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

  const ChangeNetwork = () => {
    return (<div>Must connect to {networkName} network to load bounties</div>);
  };

  return (
    <>
      {isLoading ? <Loading /> : isConnected ? isOnCorrectNetwork.get() ? <BountyList /> : <ChangeNetwork /> : <MustConnect />}
    </>
  );

};

export default BountyCardList;
