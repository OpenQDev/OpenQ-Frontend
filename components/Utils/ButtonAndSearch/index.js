import React from 'react';
import SearchBar from '../../SearchBar';

const ButtonAndSearch = ({ handleSearchInput, searchText, CTAButton }) => {
  return (
    <>
      <SearchBar
        onKeyUp={handleSearchInput}
        placeholder={'Filter...'}
        searchText={searchText}
        label={'search text'}
        styles={'rounded-sm w-full'}
      />
      <CTAButton />
    </>
  );
};

export default ButtonAndSearch;
