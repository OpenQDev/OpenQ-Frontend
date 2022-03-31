// Third Party
import React from 'react';

const SearchBar = ({ onKeyUp, onEnter, placeholder, searchText, borderShape }) => {
	return (
		<input
			className={`flex-1 lg:col-span-3 col-span-4 outline-none font-mont py-2 p-5 ${borderShape} border-web-gray bg-dark-mode text-white`}
			onChange={(e) => onKeyUp(e)} onKeyDown={(e)=>{(e.key ==='Enter') && onEnter && onEnter();} } value={searchText}
			type="text"
			placeholder={placeholder}
		></input>
	);
};

export default SearchBar;
