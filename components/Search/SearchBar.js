// Third Party
import React from 'react';

const SearchBar = ({ onKeyUp, placeholder, searchText }) => {
	return (
		<input
			className="col-span-3 outline-none font-mont rounded-l-lg py-2 p-5 border-b border-l border-t border-web-gray bg-dark-mode text-white"
			onChange={(e) => onKeyUp(e)} value={searchText}
			type="text"
			placeholder={placeholder}
		></input>
	);
};

export default SearchBar;
