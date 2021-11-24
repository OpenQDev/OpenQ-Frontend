// Third Party
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";

// Custom
import useWeb3 from "../../hooks/useWeb3";
import StoreContext from "../../store/Store/StoreContext";
import BountyCardDetails from "../../components/BountyCards/BountyCardDetails";

const address = () => {
  // Context
  const { library, active } = useWeb3();
  const [appState] = useContext(StoreContext);
  const router = useRouter();

  // State
  const { address } = router.query;
  const [issueId, setIssueId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fundingData, setFundingData] = useState([]);
  const [isClaimed, setIssueIsClaimed] = useState(true);
  const [issue, setIssue] = useState(null);
  const [tvl, setTvl] = useState(0);

  // Methods

  async function getIssueId() {
    const issueId = await appState.openQClient.getIssueIdFromAddress(
      library,
      address
    );
    setIssueId(issueId);
  }

  async function getIssueIsOpen() {
    const isOpen = await appState.openQClient.getIssueIsOpen(library, issueId);
    setIssueIsClaimed(!isOpen);
  }

  async function getIssueData() {
    try {
      const response = await appState.githubRepository.fetchIssueById(issueId);
      setIssue(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDeposits() {
    const issueIdToAddresses = { [issueId]: address };
    const fundingDataObject = await appState.openQClient.getIssueDeposits(
      library,
      issueIdToAddresses
    );
    setFundingData(fundingDataObject);
    setIsLoading(false);
  }

  // Hooks
  useEffect(() => {
    if (address && active) {
      getIssueId();
    }
  }, [address, active]);

  useEffect(() => {
    if (issueId) {
      getIssueData();
      getIssueIsOpen();
    }
  }, [issueId]);

  useEffect(() => {
    if (issue) {
      getDeposits();
    }
  }, [issue]);

  useEffect(async () => {
    if (fundingData[issueId]) {
      const deposits = fundingData[issueId];
      let cleanedDeposits = {};
      deposits.map((d) => {
        let coin;
        if (d.name == "Fake") {
          coin = "ethereum";
        } else if (d.name == "Mock") {
          coin = "bitcoin";
        } else {
          coin = d.name;
        }
        cleanedDeposits[coin] = d.balance;
      });

      const data = cleanedDeposits;
      const url = appState.coinApiBaseUrl + "/tvl";

      //only query tvl for bounties that have deposits
      if (JSON.stringify(data) != "{}") {
        await axios
          .post(url, data)
          .then((result) => {
            setTvl(result.data.total);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  });

  // Render
  if (isLoading) {
    return "Loading...";
  } else {
    return (
      <div>
        <div className="flex font-mont pt-7 justify-center items-center">
          <div className="">
            <div className="flex flex-col">
              <BountyCardDetails
                issue={issue}
                isClaimed={isClaimed}
                issueColor={Math.floor(Math.random() * 5)}
                deposits={fundingData[issueId]}
                totalDeposits={tvl.toFixed(2)}
                address={address}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default address;
