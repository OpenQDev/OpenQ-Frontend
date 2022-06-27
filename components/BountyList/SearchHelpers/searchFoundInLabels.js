const searchFoundInLabels =(bounty, lowerCaseSearch)=>{return  bounty.labels.reduce((accum, label) => {
	// Already found.
	if (accum) return true;
	const searchInLabel = label.name.toLowerCase()
		.indexOf(lowerCaseSearch) > -1;
	return searchInLabel;
}, false);};

export default searchFoundInLabels;