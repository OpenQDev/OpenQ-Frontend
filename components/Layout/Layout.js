// Third Party
import React from "react";
// Custom
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";
import Navbar from "../Layout/Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <div className="flex flex-row">
        <Navbar />
        <div className="flex pl-20 w-full flex-col pt-5 justify-center">
          <div className="flex flex-row pr-5 space-x-4 items-center justify-end">
            <ConnectButton />
            <div className="w-9 pt-1">
              <ProfilePicture />
            </div>
          </div>
          <div className="flex pt-20 justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
