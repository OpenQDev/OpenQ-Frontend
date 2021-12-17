import React, { useState } from "react";
import TokenSearch from "./TokenSearch";
import Image from "next/image";

const TokenFundBox = ({ onCurrencySelect, onVolumeChange, token, volume }) => {
  const [showTokenSearch, setShowTokenSearch] = useState(false);

  return (
    <div className="flex font-mont flex-row space-x-3 text-base items-center text-gray-600 ">
      <div className="flex flex-row items-center bg-gray-100 pl-6 font-bold text-gray-600 rounded-lg py-1 text-base bg-gray-100 shadow-inner text-white">
        <div className={"pl-4 font-bold fundBox-amount"}>
          <input
            className={"font-sembold number outline-none"}
            value={volume}
            placeholder={"0"}
            id="amount"
            onChange={(event) => onVolumeChange(event.target.value)}
          />
        </div>
        <div>
          <button
            className="flex flex-row items-center space-x-1 drop-shadow-lg text-base bg-gray-100 rounded-lg p-2 pr-2"
            onClick={() => setShowTokenSearch(true)}
          >
            <div className="flex flex-row space-x-5 items-center justify-center">
              <div className="h-1 w-6 pb-5">
                <Image src={token.logoURI} alt="n/a" width="40%" height="40%" />
              </div>
            </div>
            <div className="pl-2 text-black">{token.symbol}</div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="black"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
      {showTokenSearch ? (
        <TokenSearch
          setShowTokenSearch={setShowTokenSearch}
          onCurrencySelect={onCurrencySelect}
        />
      ) : null}
    </div>
  );
};

export default TokenFundBox;
