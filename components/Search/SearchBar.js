// Third Party
import React from 'react';

const SearchBar = ({ onKeyUp, placeholder, searchText, borderShape }) => {
	return (
		<input
			className={`col-start-1 col-end-2 lg:col-end-8 md:col-end-6 sm:col-end-4 outline-none font-mont py-2 p-5 ${borderShape} border-web-gray bg-dark-mode text-white`}
			onChange={(e) => onKeyUp(e)} value={searchText}
			type="text"
			placeholder={placeholder}
		></input>
	);
};

export default SearchBar;
