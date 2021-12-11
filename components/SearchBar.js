// Third Party
import React from 'react';

const SearchBar = ({ onKeyUp }) => {

	return (
		<div>
			<input onKeyUp={(e) => onKeyUp(e)} type="text"></input>
		</div>
	);
};

export default SearchBar;
