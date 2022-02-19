// Third Party
import React from 'react';

const SearchBar = ({ onKeyUp, placeholder }) => {
	return (
		<input
			className="col-span-3 outline-none font-mont rounded-lg py-2 p-5 border border-web-gray bg-dark-mode text-white"
			onKeyUp={(e) => onKeyUp(e)}
			type="text"
			placeholder={placeholder}
		></input>
	);
};

export default SearchBar;
