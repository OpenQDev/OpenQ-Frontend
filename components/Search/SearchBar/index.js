// Third party
import React from 'react';

const SearchBar = ({ onKeyUp, placeholder, searchText, label, styles }) => {
  return (
    <input
      className={`flex-1 lg:col-span-3 col-span-4 input-field-big ${styles}`}
      onChange={(e) => onKeyUp(e)}
      value={searchText}
      aria-label={label}
      type='text'
      placeholder={placeholder}
    ></input>
  );
};

export default SearchBar;
