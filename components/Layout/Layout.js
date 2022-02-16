// Third Party
import React, { useState, useEffect, useRef } from "react";
// Custom
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";
import Navbar from "../Layout/Navbar";
import { useMediaQuery } from "../../scripts/useMediaQuery";

const Layout = ({ children }) => {
  /* let isPageWide = useMediaQuery("(min-width: 500px)");
  const [isClosed, setClosed] = useState(isPageWide);
  let menuRef = useRef();

  useEffect(() => {
    setClosed(!isPageWide);
    console.log("isClosed: ", isClosed);
    if (!isClosed) {
      let handler = (event) => {
        if (!menuRef.current.contains(event.target) && !isPageWide) {
          setClosed(true);
        }
      };

      window.addEventListener("mousedown", handler);

      return () => {
        window.removeEventListener("mousedown", handler);
      };
    }
  }); */

  return (
    <div>
      <div className="flex flex-row">
        <Navbar />
        <div className="flex w-full flex-col pt-5 justify-center">
          <div className="flex flex-row pr-5 space-x-4 items-center justify-end">
            <ConnectButton />
            <div className="w-9 pt-1">
              <ProfilePicture />
            </div>
          </div>
          <div className="pt-20 justify-center">{children}</div>
          {/*  <div className="bg-dark-mode min-h-screen text-white"> test</div> */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
