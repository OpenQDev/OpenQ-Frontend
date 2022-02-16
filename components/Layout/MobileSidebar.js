// Third Party
import React from "react";

// Custom
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";

const MobileSidebar = () => {
  return (
    <div className="flex justify-between w-full md:hidden">
      <div className="pl-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
      <div className="flex flex-row pr-5 space-x-4 items-center justify-end">
        <ConnectButton />
        <div className="w-9 pt-1">
          <ProfilePicture />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
