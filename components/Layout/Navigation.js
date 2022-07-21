// Third party
import React, { useState, useEffect, useContext } from "react";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";
import axios from "axios";
import Link from 'next/link';
// Custom
import StoreContext from "../../store/Store/StoreContext.js";
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";
import Image from "next/image";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import FirstTimeBanner from "./FirstTimeBanner";
import Footer from "./Footer.js";
import useWeb3 from "../../hooks/useWeb3.js";

const Navigation = ({}) => {
  const [gnosisSafe, setGnosisSafe] = useState();
  const [safeInfo, setSafeInfo] = useState();
  const { account, activate, deactivate } = useWeb3();
  const [appState] = useContext(StoreContext);
  useEffect(async () => {
    //const openQPrismaClient = new WrappedOpenQPrismaClient();
    const safe = new SafeAppConnector();
    safe.getSafeInfo().then((data) => {
      if (data) {
        setSafeInfo(data);
        deactivate();
      }
    });
    setGnosisSafe(safe);

    // First tokens + matic
    const GET_PRICES = {
      query: `{
			prices {
    				timestamp
    				priceObj
  			
			}
		}`,
    };
    let tokenPrices = {};

    try {
      if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "local") {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_OPENQ_API_URL}/prices`
        );
        tokenPrices = response.data[0].priceObj;
      } else {
        const response = await axios({
          url: process.env.NEXT_PUBLIC_OPENQ_API_URL,
          method: "post",
          headers: { "content-type": "application/json" },
          data: GET_PRICES,
        });
        tokenPrices = response?.data?.data?.prices?.priceObj || {};
      }
    } catch (err) {
      console.log("could not fetch initial prices", err);
    }

    appState.tokenClient.firstTenPrices = tokenPrices;
  }, []);

  useEffect(async () => {
    if (safeInfo) {
      await activate(gnosisSafe);
    }
  }, [account]);
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="bg-nav-bg py-1">
      <FirstTimeBanner />
      <div className="flex flex-row">
        {/* <Sidebar trigger={sidebar} setTrigger={setSidebar} /> */}

        <div className="flex w-full flex-col md:py-1 justify-center">
          {/*  Mobile navbar triggered by tailwind */}
          {/* <MobileSidebar trigger={setSidebar} /> */}

          <div className="flex justify-between invisible md:visible px-7">
            <div className="flex flex-row space-x-5 items-center">
						<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`}>
							<a className="flex items-center">
              	<Image
									src="/openq-logo-white-2.png"
									alt="OpenQ"
									width="31"
									height="31"
								/>
							</a>
							</Link>
              {/* <div className="flex justify-between space-x-28 items-center input-field">
                <div>Search or jump to...</div>
                <div className="border border-gray-700 text-gray-400 rounded-sm px-2">
                  /
                </div>
              </div> */}
              <input
                className="flex justify-between pr-24 items-center input-field"
                onKeyUp={(e) => setQuickSearch(e.target.value)}
                type="text"
                placeholder="Search OpenQ"
              ></input>
              <div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer">
                Atomic contracts
              </div>
              <div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer">
                Contests
              </div>
              <div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer">
                Communities
              </div>
              <div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer">
                Explore
              </div>
            </div>
            {/* 	Profile and login components */}
            <div className="flex flex-row items-center">
              <div>
                <ConnectButton />
              </div>
              <div>
                <ProfilePicture />
              </div>
            </div>
          </div>
          <div
            className={`pt-18 justify-center${sidebar ? "opacity-20" : null}`}
          ></div>
        </div>
      </div>
      {/*   <Footer /> */}
    </div>
  );
};

export default Navigation;
