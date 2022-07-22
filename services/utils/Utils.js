class Utils {
	constructor() { }

	monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	formatUnixDate = (unixTime, hideDate) => {
		var date = new Date(unixTime * 1000);

		var day = date.getDate();
		var month = this.monthNames[date.getMonth()];
		var year = date.getFullYear();

		// Hours part from the timestamp
		var hours = date.getHours();
		// Minutes part from the timestamp
		var minutes = '0' + date.getMinutes();
		// Seconds part from the timestamp
		var seconds = '0' + date.getSeconds();

		// Will display time in 10:30:23 format
		if(hideDate){
			return `${month} ${day}, ${year}`;
		}
		var formattedTime = `${month} ${day}, ${year}`;
		return formattedTime;
	};

	formatDate = (createdAt, hideDate) => {
		return this.formatUnixDate(new Date(createdAt), hideDate);
	};


	formatUnixDateWithTime = (unixTime, hideDate) => {
		var date = new Date(unixTime * 1000);

		var day = date.getDate();
		var month = this.monthNames[date.getMonth()];
		var year = date.getFullYear();

		// Hours part from the timestamp
		var hours = date.getHours();
		// Minutes part from the timestamp
		var minutes = '0' + date.getMinutes();
		// Seconds part from the timestamp
		var seconds = '0' + date.getSeconds();

		// Will display time in 10:30:23 format
		if(hideDate){
			return `${month} ${day}, ${year}`;
		}
		var formattedTime = `${month} ${day}, ${year}`;
		return formattedTime;
	};

	formatDate = (createdAt, hideDate) => {
		return this.formatUnixDate(new Date(createdAt), hideDate);
	};

	issurUrlRegex = (issueUrl) => {
		const pattern = /https?:\/\/github\.com\/(?:[^\/\s]+\/)+(?:issues\/\d+)/;
		return pattern.test(issueUrl);
	};

	userUrlRegex = (userUrl) => {
		const pattern = /https?:\/\/github\.com\/[\w-\d]+/;
		return pattern.test(userUrl);
	}
	
	updateVolume(volume, updater) {
		const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
		if (numberRegex.test(volume) || volume === '' || volume === '.') {
			updater(volume.match(numberRegex)[0]);
		}
	}

	formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	combineBounties  = (subgraphBounties, githubIssues, metadata = [])=>{
		const fullBounties = [];
		subgraphBounties.forEach((bounty) => {
			const relatedIssue = githubIssues.find(
				(issue) => issue.id == bounty.bountyId
			);
			

			const relatedMetadata = metadata.find((metadataBounty)=>{
				return 	metadataBounty.address.toLowerCase()===bounty.bountyAddress;
			}) || {};
			if(relatedIssue && relatedMetadata){
				let mergedBounty = { ...bounty, ...relatedIssue, ...relatedMetadata };
				fullBounties.push(mergedBounty);}

		
		}	);
		return fullBounties;
	}

	capitalize = (word) =>{
		return word[0].toUpperCase() + word.substring(1);
	}


// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
pageview = (url) => {
	window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
		page_path: url,
	});
}


	toIng = (word, bool)=>{
		if(bool)		return word.slice(0, length-1)+ 'ing';
		return word;};


}

export default Utils;