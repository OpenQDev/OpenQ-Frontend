// Third Party
import React from "react";
import TokenList from "./TokenList";

const TokenSearch = ({ setShowTokenSearch, onCurrencySelect }) => {
  return (
    <div>
      <div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-1/4">
          <div className="flex justify-left border-0 pl-8 pr-8 pt-5 pb-3 rounded-lg shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
            <div className="flex items-start justify-between border-solid rounded-t">
              <h3 className="text-1xl font-semibold text-white">
                Select a Token
              </h3>
            </div>
            <div className="pt-4">
              <TokenList
                onCurrencySelect={onCurrencySelect}
                setShowTokenSearch={setShowTokenSearch}
              />
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
              <button
                className="text-white confirm-btn font-bold px-6 py-3 text-lg text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowTokenSearch(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default TokenSearch;
