// Third Party
import React, { useState } from "react";
import Head from "next/head";

// Custom
import BountyHomepage from "../components/Bounty/BountyHomepage";
import OpenQHomepage from "../components/Homepage/OpenQHomepage";

export default function Index() {
  const [internalMenu, setInternalMenu] = useState("issue");

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
        <div className="bg-dark-mode pt-10 flex-col">
          <div className="flex justify-center pb-8">
            <div className="flex flex-row justify-center space-x-2 border border-web-gray p-1 rounded-xl w-fit">
              <button
                onClick={() => setInternalMenu("org")}
                className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
                  internalMenu == "org" ? "bg-gray-500" : null
                }`}
              >
                Organizations
              </button>
              <button
                onClick={() => setInternalMenu("issue")}
                className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
                  internalMenu == "issue" ? "bg-gray-500" : null
                }`}
              >
                Issues
              </button>
            </div>
          </div>
          <div className="px-5 md:px-14">
            {internalMenu == "org" ? <OpenQHomepage /> : <BountyHomepage />}
          </div>
        </div>
      </main>
    </div>
  );
}
