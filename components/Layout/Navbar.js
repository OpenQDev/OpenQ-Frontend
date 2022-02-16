// Third Party
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
// Custom
import { useMediaQuery } from "../../scripts/useMediaQuery";

const Navbar = () => {
  let isPageWide = useMediaQuery("(min-width: 500px)");
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
  });

  return (
    // Mobile Menu Bar

    // Sidebar
    <div className="absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex">
        <div
          ref={menuRef}
          className="bg-dark-mode w-20 flex min-h-screen flex-col border-r border-web-gray"
        >
          <nav className="text-white flex flex-col space-y-4 items-center pt-1 flex-grow">
            <div className="pb-8 pt-5">
              <Link href="/">
                <a href="">
                  <Image
                    src="/openq-logo.png"
                    alt="OpenQ"
                    width="31"
                    height="31"
                  />
                </a>
              </Link>
            </div>
            <div className="pt-2">
              <Link href="/claim">
                <a>
                  <Image
                    src="/eth-white.png"
                    alt="OpenQ"
                    width="24"
                    height="24"
                  />
                </a>
              </Link>
            </div>
            <div className="pt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="grey"
              >
                <path d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" />
              </svg>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
