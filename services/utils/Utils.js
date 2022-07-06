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
		var formattedTime = `${month} ${day}, ${year} at ${hours}:${minutes.substr(-2) + ':' + seconds.substr(-2)}`;
		return formattedTime;
	};

	formatDate = (createdAt, hideDate) => {
		return this.formatUnixDate(new Date(createdAt).getTime() / 1000, hideDate);
	};

	issurUrlRegex = (issueUrl) => {
		const pattern = /https?:\/\/github\.com\/(?:[^\/\s]+\/)+(?:issues\/\d+)/;
		return pattern.test(issueUrl);
	};

	userUrlRegex = (userUrl) => {
		const pattern = /https?:\/\/github\.com\/[\w-\d]+/;
		return pattern.test(userUrl);
	}

	formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	combineBounties  = (subgraphBounties, githubIssues)=>{
		const fullBounties = [];
		subgraphBounties.forEach((bounty) => {
			const relatedIssue = githubIssues.find(
				(issue) => issue.id == bounty.bountyId
			);
			if(relatedIssue){
				const mergedBounty = { ...bounty, ...relatedIssue };
				fullBounties.push(mergedBounty);}
		
		}	);
		return fullBounties;
	}
}

export default Utils;