// Third Party
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

// Custom
import StoreContext from "../../store/Store/StoreContext";
import BountyCardDetails from "../../components/Bounty/BountyCardDetails";
import FundBountyButton from "../../components/FundBounty/FundBountyButton";
import RefundBountyButton from "../../components/RefundBounty/RefundBounty";
import useGetTokenValues from "../../hooks/useGetTokenValues";
import ClaimBountyButton from "../../components/Claim/ClaimBountyButton";
import useAuth from "../../hooks/useAuth";
import AuthButton from "../../components/Authentication/AuthButton";

const address = () => {
  // Context
  const [appState] = useContext(StoreContext);
  const router = useRouter();
  useAuth();
  const [redirectUrl, setRedirectUrl] = useState("");

  // State
  const { address } = router.query;
  const [bounty, setBounty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hooks
  useEffect(() => {
    if (address) {
      setRedirectUrl(`${appState.baseUrl}/bounty/${address}`);
    }
  }, [address]);

  // Methods
  async function populateBountyData() {
    setIsLoading(true);
    const bounty = await appState.openQSubgraphClient.getBounty(address);

    const issueData = await appState.githubRepository.fetchIssueById(
      bounty.bountyId
    );

    const mergedBounty = { ...bounty, ...issueData };

    setBounty(mergedBounty);
    setIsLoading(false);
  }

  // Hooks
  useEffect(() => {
    if (address) {
      populateBountyData();
    }
  }, [address]);

  // Refactor this hook our to be shared
  const [tokenValues] = useGetTokenValues(bounty);

  // Render
  if (isLoading) {
    return "Loading...";
  } else {
    return (
      <div>
        <div className="flex font-mont pt-7 justify-center items-center">
          <div className="flex flex-row">
            <div>
              <BountyCardDetails bounty={bounty} tokenValues={tokenValues} />
            </div>
            <div className="pt-10">
              {" "}
              <FundBountyButton bounty={bounty} />
            </div>
          </div>
          {/* 	<RefundBountyButton address={address} issueUrl={bounty.url} />
						<ClaimBountyButton issueUrl={bounty.url} />
						<AuthButton redirectUrl={redirectUrl} /> */}
        </div>
      </div>
    );
  }
};

export default address;
