// Third Party
import React, { useState } from "react";
// Custom
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

const Layout = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div>
      <div className="flex flex-row">
        <Sidebar trigger={sidebar} setTrigger={setSidebar} />

        <div className="flex w-full flex-col pt-5 justify-center">
          {/*  Mobile navbar triggered by tailwind */}
          <MobileSidebar trigger={setSidebar} />

          <div className="flex justify-end invisible md:visible">
            {/* 	Profile and login components */}
            <div className="flex flex-row items-center pr-5">
              <div className="pr-5">
                <ConnectButton />
              </div>
              <div className="w-9 pt-1">
                <ProfilePicture />
              </div>
            </div>
          </div>
          <div
            className={`pt-18 md:pl-20 justify-center ${
              sidebar ? "opacity-20 pl-20" : null
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
