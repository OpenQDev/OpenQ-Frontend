// Third Party
import React from "react";

const SearchBar = ({ onKeyUp }) => {
  return (
    <div>
      <input
        className="outline-none font-mont w-full rounded-lg py-2 p-5 border border-web-gray bg-dark-mode text-white"
        onKeyUp={(e) => onKeyUp(e)}
        type="text"
        placeholder="Search Organization..."
      ></input>
    </div>
  );
};

export default SearchBar;
