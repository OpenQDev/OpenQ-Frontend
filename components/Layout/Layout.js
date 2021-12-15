// Third Party
import React from "react";
// Custom
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";
import MintBountyButton from "../MintBounty/MintBountyButton";
import Navbar from "../Layout/Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar>
        <div className="flex flex-grow  font-mont pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between space-x-1">
          <div className="font-bold text-xl">OpenQ</div>
          <div className="flex flex-row space-x-2">
            <MintBountyButton />
            <ProfilePicture />
            <ConnectButton />
          </div>
        </div>
        {children}
      </Navbar>
    </div>
  );
};

export default Layout;
