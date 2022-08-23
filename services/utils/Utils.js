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
		var minutes =  date.getMinutes();
		const displayMinutes =`${minutes.toString().length===1 ? '0': ''}${minutes}`;
		// Seconds part from the timestamp
		//var seconds = '0' + date.getSeconds();

		// Will display time in 10:30:23 format
		if (hideDate) {
			return `${month} ${day}, ${year}`;
		}
		var formattedTime = `${month} ${day}, ${year} at ${hours}:${displayMinutes}`;
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

		// // Hours part from the timestamp
		// var hours = date.getHours();
		// // Minutes part from the timestamp
		// var minutes = '0' + date.getMinutes();
		// // Seconds part from the timestamp
		// var seconds = '0' + date.getSeconds();

		// Will display time in 10:30:23 format
		if (hideDate) {
			return `${month} ${day}, ${year}`;
		}
		var formattedTime = `${month} ${day}, ${year}`;
		return formattedTime;
	};

	formatDate = (createdAt, hideDate) => {
		return this.formatUnixDate(new Date(createdAt)/1000, hideDate);
	};

	issurUrlRegex = (issueUrl) => {
		const pattern = /https?:\/\/github\.com\/(?:[^\/\s]+\/)+(?:issues\/\d+)/;
		return pattern.test(issueUrl);
	};

	userUrlRegex = (userUrl) => {
		const pattern = /https?:\/\/github\.com\/[\w-\d]+/;
		return pattern.test(userUrl);
	};

	updateVolume(volume, updater) {
		const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
		if (numberRegex.test(volume) || volume === '' || volume === '.') {
			updater(volume.match(numberRegex)[0]);
		}
	}
	// Thanks rmwxiong https://gist.github.com/rmwxiong/ad6e922dcc739a599640/02854508d14e737e38293c5467d75c45843830c8
	avgcolor(color1, color2) {
		var avg = function (a, b) { return (a + b) / 2; },
			t16 = function (c) { return parseInt(('' + c), 16); },
			hex = function (c) {
				var t = (c >> 0).toString(16);
				return t.length == 2 ? t : '0' + t;
			},
			hex1 = t16(color1),
			hex2 = t16(color2),
			r = function (hex) { return hex >> 16 & 0xFF; },
			g = function (hex) { return hex >> 8 & 0xFF; },
			b = function (hex) { return hex & 0xFF; },
			res = hex(avg(r(hex1), r(hex2)))
				+ hex(avg(g(hex1), g(hex2)))
				+ hex(avg(b(hex1), b(hex2)));
		return res;
	}

	formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	combineBounties = (subgraphBounties, githubIssues, metadata) => {
		const fullBounties = [];
		subgraphBounties.forEach((bounty) => {
			const relatedIssue = githubIssues.find(
				(issue) => issue.id == bounty.bountyId
			);


			const relatedMetadata = metadata.find((metadataBounty) => {
				return metadataBounty.address?.toLowerCase() === bounty.bountyAddress;
			}) || {};
			if (relatedIssue && relatedMetadata && !relatedMetadata.blacklisted) {
				let mergedBounty = { ...relatedIssue, ...bounty, ...relatedMetadata };
				fullBounties.push(mergedBounty);
			}


		});
		return fullBounties;
	};

	getBountyMarker = (bounty, login)=>{
		if(bounty.bountyType==='0'){
			if(bounty.status == '1'){
				if(bounty.claims?.length && bounty?.prs?.some(pr =>pr.source.author?.login===login)){
					return {status: 'Claimed', colour: 'bg-danger', fill: 'fill-danger'};
				}
				return {status: 'Closed', colour: 'bg-danger', fill: 'fill-danger'};
			}
			if(bounty.status == '0' && bounty?.prs?.some(pr =>pr.source.merged)){
				{
					if(bounty?.prs?.some(pr =>pr.source.author?.login===login)){
			
						return { status: 'Claim Available', colour: 'bg-closed', fill: 'fill-closed'};			
					}
					return{status: 'Closed', colour: 'bg-danger', fill: 'fill-danger'};			
				}
			}
			if(bounty.assignees[0]){
				return {status:'In Progress', colour: 'bg-yellow-500 text-black fill-black', fill: 'fill-yellow-500'};}
			else{
				return {status: 'Ready for Work', colour: 'bg-green', fill: 'fill-green'};
			}
		}
		else if (bounty.bountyClosedTime){
			return{status: 'Closed', colour: 'bg-closed', fill: 'fill-closed'};
		}
		else{return {status: 'Open', colour: 'bg-green', fill: 'fill-green'}; }

	};
	
	fetchOrganizations = async({githubRepository, openQPrismaClient}, category)=>{
		let githubOrganizations=[];
		let renderError = '';
		const batch = 100;
		const orgData = await openQPrismaClient.getOrganizations(category, batch);
		const filteredOrgs=orgData.organizations.filter(data=>!data.blacklisted);
		const orgIds=filteredOrgs.map(org=>org.id);
		try {
			githubOrganizations = await githubRepository.fetchOrgsOrUsersByIds(
				orgIds
			);
		} catch (err) {
			if(!renderError){
				console.error(err);
				renderError = 'OpenQ is unable to connect with Github.';
			}
		}

		const mergedOrgs = filteredOrgs.map((org) => {
			let currentGithubOrg;
			for (const githubOrganization of githubOrganizations) {
				if (org.id === githubOrganization.id) {
					currentGithubOrg = githubOrganization;
				}
			}
			return {  ...org, ...currentGithubOrg };
		}).filter((org)=>{
			return !org.blacklisted;
		})||[];
		return [mergedOrgs, renderError];
	};

	fetchBounties = async({openQSubgraphClient, githubRepository, openQPrismaClient},  batch, category, sortOrder, orderBy, cursor, organization)=>{
		let renderError='';
		let prismaContracts;
		let newCursor;
		try{
			const prismaContractsResult = await openQPrismaClient.getContractPage(
				cursor,
				batch,
				orderBy,
				sortOrder,
				category, organization);
			prismaContracts = prismaContractsResult.nodes.filter(contract=>!contract.blacklisted);

			newCursor = prismaContractsResult.cursor;
			
		}
		catch(err){		
			console.log(err);
		}
		const bountyAddresses = prismaContracts.map(bounty=>bounty.address.toLowerCase());
		const bountyIds = prismaContracts.map(contract=>contract.bountyId);
		const subgraphContracts = await openQSubgraphClient.getBountiesByContractAddresses(bountyAddresses);
		
		const		githubIssues = await githubRepository.getIssueData(bountyIds);
		const fullBounties = this.combineBounties(subgraphContracts, githubIssues, prismaContracts);
		
		return [fullBounties, newCursor, renderError];
	};
	
	fetchWatchedBounties = async({openQSubgraphClient, githubRepository, openQPrismaClient}, account, category)=>{
		let subgraphContracts=[];
		let githubIssues=[];
		let prismaContracts = [];
		try {
			const prismaResult = await openQPrismaClient.getUser(
				account, category
			);
			prismaContracts = prismaResult.watchedBounties.nodes;
			const watchedBountyAddresses= prismaResult.watchedBountyIds.map(address=>address.toLowerCase());
			const watchedBountyIds = prismaContracts.map(
				(contract) =>contract.bountyId
			);
			subgraphContracts = await openQSubgraphClient.getBountiesByContractAddresses(watchedBountyAddresses);
			githubIssues = await githubRepository.getIssueData(
				watchedBountyIds
			);
		
		} catch (err) {
			console.log(err);
		}
		const watchedBounties =this.combineBounties(subgraphContracts, githubIssues, prismaContracts, );
		
		return [watchedBounties];
	}


	mergeOrdered = (left, right, lProperty, rProperty)=>{
		const mergedArr = [];		
		let il= 0, ir =0, i =0;
		while(il<left.length && ir <right.length ){
			if(left[il][lProperty]> right[ir][rProperty]){
				mergedArr[i++] = left[il++];
			}
			else{
				mergedArr[i++] = right[ir++];
			}
		}
		if(left[ir]){
			while(il<left.length){
				mergedArr[i++] = left[il++];
			}
		}
		if(right[ir]){
			while( right[ir]?.[rProperty]){
				mergedArr[i++] = right[ir++];		
			}
		}
		return mergedArr;
	};

	capitalize = (word) =>{
		return word[0].toUpperCase() + word.substring(1);
	};


	// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
	pageview = (url) => {
		window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
			page_path: url,
		});
	};


	toIng = (word, bool) => {
		if (bool) return word.slice(0, length - 1) + 'ing';
		return word;
	};


}

export default Utils;