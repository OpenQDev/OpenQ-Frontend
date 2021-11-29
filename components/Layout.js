// Third Party
import React from "react";
// Custom
import Footer from "./Footer";
import ProfilePicture from "./ProfilePicture";
import ConnectButton from "./WalletConnect/ConnectButton.js";
import Navbar from "./Navbar.js";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar>
        <div className="flex flex-grow pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between">
          <div className="font-bold text-xl font-mont text-gray-800">OpenQ</div>
          <ConnectButton />
        </div>
        {children}
        {/* 	<Footer /> */}
      </Navbar>
    </div>
  );
};

export default Layout;
