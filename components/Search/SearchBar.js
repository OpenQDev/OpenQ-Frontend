// Third Party
import React from 'react';

const SearchBar = ({ onKeyUp, placeholder, searchText, borderShape }) => {
	return (
		<input
			className={`col-span-3 outline-none font-mont py-2 p-5 ${borderShape} border-web-gray bg-dark-mode text-white`}
			onChange={(e) => onKeyUp(e)} value={searchText}
			type="text"
			placeholder={placeholder}
		></input>
	);
};

export default SearchBar;
