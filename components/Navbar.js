import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "../scripts/useMediaQuery";

const Navbar = () => {
  let isPageWide = useMediaQuery("(min-width: 500px)");
  const [isClosed, setClosed] = useState(!isPageWide);
  let menuRef = useRef();

  useEffect(() => {
    if (!isClosed) {
      let handler = (event) => {
        if (!menuRef.current.contains(event.target)) {
          setClosed(true);
          console.log(menuRef.current);
          console.log("recognized click");
        }
      };

      window.addEventListener("mousedown", handler);

      return () => {
        window.removeEventListener("mousedown", handler);
      };
    }
  });

  return (
    <div>
      <div className="flex bg-gray-100">
        {!isClosed && (
          <aside
            ref={menuRef}
            className="bg-white w-40 min-h-screen flex flex-col"
          >
            {/*  <div class="bg-white broder-r broder-b px-4 h-10 flex items-center">
            {" "}
            <span>Application</span>
          </div> */}

            <div className="flex justify-center pt-4 border-r flex-grow">
              <nav>
                <ul>
                  <li className="p-3">
                    <a href=""> Home </a>
                  </li>
                  <li className="p-3">
                    <a href=""> Notifications </a>
                  </li>
                  <li className="p-3">
                    <a href=""> Messages </a>
                  </li>
                  <li className="p-3">
                    <a href=""> Settings </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        )}
        <main className="flex-grow flex flex-col min-h-screen">
          <header className="bg-white h-10 flex items-center justify-center">
            <div
              className={
                "flex flex-grow items-center px-3 " +
                (isClosed ? "justify-between" : "justify-end")
              }
            >
              {isClosed && (
                <button
                  aria-label="pen menu"
                  title="Open menu"
                  className="w-10 p-1"
                  onClick={() => setClosed(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}
              <button className="text-blue-700 underline">
                Connect Wallet
              </button>
            </div>
          </header>
        </main>
      </div>
    </div>
  );
};

export default Navbar;
