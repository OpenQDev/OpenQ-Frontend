
const searchTagInBounty = (bounty, tagArr)=>{
	return tagArr.reduce((accum, tag) => {
		if (accum === false) return false;
		return bounty.labels.some(label => label.name.toLowerCase() === tag.toLowerCase()) || bounty.languages.some((language)=>language.name.toLowerCase()===tag);
	}, true);
};

export default searchTagInBounty;