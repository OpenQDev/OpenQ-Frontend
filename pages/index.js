// Third Party
import React from "react";
import Head from "next/head";

// Custom
import BountyHomepage from "../components/Bounty/BountyHomepage";
import OpenQHomepage from "../components/Homepage/OpenQHomepage";

export default function Index() {
  return (
    <div>
      <Head>
        <title>OpenQ</title>
        <meta
          name="OpenQ Bounties"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="bg-dark-mode pl-12 pt-10 flex-col">
          <div
            className="flex flex-row justify-center items-center w-1/5
					rounded-lg border border-web-gray space-x-3"
          >
            <div className="text-white">Organizations</div>
            <div className="text-white">Issues</div>
          </div>
          {/*  <OpenQHomepage /> */}
          <BountyHomepage />
        </div>
      </main>
    </div>
  );
}
