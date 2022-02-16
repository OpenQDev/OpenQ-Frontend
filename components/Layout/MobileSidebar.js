// Third Party
import React from "react";
import Link from "next/link";
import Image from "next/image";

// Custom
import MobileConnectButton from "../WalletConnect/MobileConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";

const MobileSidebar = ({ trigger }) => {
  return (
    <div className="flex justify-between items-center w-full md:hidden pr-5">
      <button onClick={() => trigger(true)} className="pl-5">
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
      </button>
      {/* <div className="text-white text-lg font-bold font-mont">OpenQ</div> */}

      <div className="pl-7">
        <Link href="/">
          <div className="flex flex-row space-x-4">
            <Image src="/openq-logo.png" alt="OpenQ" width="31" height="31" />
            <div className="font-mont text-white font-bold text-lg">OpenQ</div>
          </div>
        </Link>
      </div>

      <div className="flex flex-row space-x-4 items-center">
        <MobileConnectButton />
        <div className="w-7">
          <ProfilePicture />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
