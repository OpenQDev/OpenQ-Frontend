// Third party
import React, { useEffect, useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import StoreContext from "../../store/Store/StoreContext";

const OrganizationCard = ({ organization }) => {
  // Context
  const [appState] = useContext(StoreContext);
  const [orgBounties, setOrgBounties] = useState();
  let orgName;
  if (organization.name) {
    orgName =
      organization?.name?.charAt(0).toUpperCase() + organization?.name.slice(1);
  } else if (organization.login) {
    orgName =
      organization?.login?.charAt(0).toUpperCase() +
      organization?.login.slice(1);
  }

  if (orgName?.length > 10) {
    orgName = orgName.slice(0, 9).concat("...");
  }

  useEffect(async () => {
    const bountyIds = organization.bountiesCreated.map(
      (bounty) => bounty.bountyId
    );

    try {
      const issuesData = await appState.githubRepository.getIssueData(
        bountyIds
      );
      const filteredBounties = appState.utils
        .combineBounties(organization.bountiesCreated, issuesData)
        .filter((bounty) => {
          return (
            !bounty.assignees.nodes[0] &&
            bounty.status === "OPEN" &&
            bounty.bountyTokenBalances.length > 0
          );
        });
      setOrgBounties(filteredBounties);
    } catch (err) {
      console.log("error");
    }
  }, organization.bountiesCreated);

  // Methods

  // Render
  return (
    <div
      className={
        !organization ? "pointer-events-none cursor-normal" : undefined
      }
    >
      <Link href={organization ? `/organization/${organization.login}` : "/"}>
        <div
          className={
            "flex flex-col p-6 items-center cursor-pointer text-[0.8rem] tracking-wider placeholder-input-gray outline-none rounded-sm border border-border-gray bg-menu-bg w-full"
          }
        >
          <div className="flex justify-end w-full items-center -mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4C535B"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <div className="w-16 h-16 relative">
            {organization?.avatarUrl ? (
              <Image
                className="rounded-full"
                src={organization.avatarUrl}
                placeholder={"blur"}
                blurDataURL={"/diverse/placeholder-px.png"}
                alt="n/a"
                layout="fill"
                priority={true}
              />
            ) : (
              <Skeleton
                baseColor="#333"
                borderRadius={"1rem"}
                height={"64px"}
                width="64px"
              />
            )}
          </div>
          <div className="pt-5 text-center w-full font-medium text-xl ">
            {orgName || (
              <Skeleton width={"50px"} height={"16px"} baseColor={"#333"} />
            )}
          </div>
          <div className=" rounded shadow-md text-gray-300 text-lg font-sans relative">
            {orgBounties && `${orgBounties.length}`}
            {orgBounties ? (
              `${orgBounties.length === 1 ? " Bounty" : " Bounties"}`
            ) : (
              <Skeleton width={"64px"} height={"16px"} baseColor={"#333"} />
            )}
          </div>
          <div className="text-center pt-2 text-gray-400">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OrganizationCard;
