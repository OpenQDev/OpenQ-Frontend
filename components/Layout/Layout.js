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
        <div className="flex flex-col h-screen">
          <div className="flex bg-dark-mode font-mont pl-12 pt-5 pb-5 items-center justify-between space-x-1 pr-5 fixed right-0 top-0">
            <div className="font-bold text-xl text-white"></div>
            <div className="flex flex-row space-x-4 items-center">
              <div className="pb-1">{/*  <MintBountyButton /> */}</div>
              <div>
                <ConnectButton />
              </div>
              <div className="w-1/12 pt-1">
                <ProfilePicture />
              </div>
            </div>
          </div>
          <div className="pt-20">{children}</div>
        </div>
      </Navbar>
    </div>
  );
};

export default Layout;
