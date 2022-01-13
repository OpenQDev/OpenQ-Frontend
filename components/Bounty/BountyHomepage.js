// Third Party
import React, { useEffect, useState, useContext } from "react";
// Custom
import BountyCard from "./BountyCard";
import StoreContext from "../../store/Store/StoreContext";
import MintBountyButton from "../MintBounty/MintBountyButton";

const BountyHomepage = () => {
  // State
  const [bounties, setBounties] = useState([]);
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");
  const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Context
  const [appState] = useContext(StoreContext);

  // Hooks
  useEffect(() => {
    populateBountyData();
  }, []);

  // Methods
  async function populateBountyData() {
    setIsLoading(true);

    const bounties = await appState.openQSubgraphClient.getAllBounties();

    const bountyIds = bounties.map((bounty) => bounty.bountyId);
    const issueData = await appState.githubRepository.getIssueData(bountyIds);

    const fullBounties = [];
    bounties.forEach((bounty) => {
      const relatedIssue = issueData.find(
        (issue) => issue.id == bounty.bountyId
      );
      const mergedBounty = { ...bounty, ...relatedIssue };
      fullBounties.push(mergedBounty);
    });

    setBounties(fullBounties);

    setIsLoading(false);
  }

  const filterByOrg = (e) => {
    setOrganizationSearchTerm(e.target.value);
  };

  const filterByIssueTitle = (e) => {
    setIssueTitleSearchTerm(e.target.value);
  };

  // Render
  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="flex justify-center items-center pt-28">
        <div className="grid grid-cols-3 gap-3">
          <input
            className="col-span-2 outline-none font-mont rounded-lg py-2 p-5 border border-web-gray bg-dark-mode text-white"
            onKeyUp={(e) => filterByIssueTitle(e)}
            type="text"
            placeholder="Search Issue..."
          ></input>
          <MintBountyButton />
          <div className="col-span-3">
            <div className="font-mont text-white pb-3">Bounties</div>
            {bounties
              .filter((bounty) => {
                return organizationSearchTerm
                  ? bounty.owner
                      .toLowerCase()
                      .indexOf(organizationSearchTerm.toLowerCase()) > -1
                  : bounty;
              })
              .filter((bounty) => {
                return issueTitleSearchTerm
                  ? bounty.title
                      .toLowerCase()
                      .indexOf(issueTitleSearchTerm.toLowerCase()) > -1
                  : bounty;
              })
              .map((bounty) => {
                return (
                  <div className="pb-3">
                    <BountyCard bounty={bounty} key={bounty.bountyId} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
};

export default BountyHomepage;
