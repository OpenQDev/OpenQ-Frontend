import React from "react";
import Link from "next/link";

export default function BountyAlreadyMintedMessage({ bountyAddress }) {
  return (
    <div className="flex flex-row items-center space-x-1">
      <div className="pt-4 text-white">Bounty is already minted, view</div>
      <Link
        href={`/?address=${bountyAddress}}`}
        as={`/bounty/${bountyAddress}`}
      >
        <a
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer text-link pt-4"
        >
          here.
        </a>
      </Link>
    </div>
  );
}
