// Third Party
import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom
import useGetTokenValues from "../../hooks/useGetTokenValues";
import StoreContext from "../../store/Store/StoreContext";
import TokenBalances from "../TokenBalances/TokenBalances";

const OrganizationCard = ({ organization }) => {
  // Context
  const [tokenValues] = useGetTokenValues(organization.fundedTokenBalances);
  const [appState] = useContext(StoreContext);
  const orgName =
    organization.name.charAt(0).toUpperCase() + organization.name.slice(1);

  // Methods

  // Render
  return (
    <div>
      <Link href={`/organization/${organization.login}`}>
        <div
          className={
            "flex flex-col p-6 items-center font-mont rounded-xl shadow-sm border border-web-gray cursor-pointer pr-10 pl-10"
          }
        >
          <div className="w-16 h-16 relative">
            <Image src={organization.avatarUrl} alt="n/a" layout="fill" />
          </div>
          <div className="pt-5 text-center font-semibold text-white">
            {orgName}
          </div>
          <div className="bg-pink text-white rounded shadow-md text-gray-300 font-sans relative">
            {`${
              organization.bountiesCreated.map(
                (bounty) => bounty.status == "OPEN"
              ).length
            } ${
              organization.bountiesCreated.map(
                (bounty) => bounty.status == "OPEN"
              ).length < 2
                ? "Bounty"
                : "Bounties"
            }`}
          </div>
          <div>
            {tokenValues ? (
              <TokenBalances
                tokenBalances={organization.fundedTokenBalances}
                tokenValues={tokenValues}
              />
            ) : null}
          </div>
          <div>
            {tokenValues ? (
              <div>{appState.utils.formatter.format(tokenValues.total)}</div>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OrganizationCard;
