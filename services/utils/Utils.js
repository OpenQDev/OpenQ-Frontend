class Utils {
	constructor() { }

	formatDate = (createdAt) => {
		const rawDate = createdAt;
		const date = new Date(rawDate);
		return date.toDateString().split(' ').slice(1).join(' ');
	};

	formatUnixDate = (createdAt) => {
		console.log(createdAt);
		var date = new Date(createdAt);

		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		console.log(year);

		// Hours part from the timestamp
		var hours = date.getHours();
		// Minutes part from the timestamp
		var minutes = '0' + date.getMinutes();
		// Seconds part from the timestamp
		var seconds = '0' + date.getSeconds();

		// Will display time in 10:30:23 format
		var formattedTime = `${month}/${day}/${year} at ${hours}:${minutes.substr(-2) + ':' + seconds.substr(-2)}`;
		return formattedTime;
	};

	parseGitHubUrl = (githubUrl) => {
		const pattern = /https?:\/\/github\.com\/(?:[^\/\s]+\/)+(?:issues\/\d+)/;
		if (!pattern.test(githubUrl)) {
			return null;
		}

		let url;
		let pathArray = [];
		let githubData = [];

		try {
			url = new URL(githubUrl);
			pathArray = url.pathname.split('/');
		} catch (error) {
			return githubData;
		}
		// orgName
		githubData.push(pathArray[1]);

		// repoName
		githubData.push(pathArray[2]);

		// issueId
		githubData.push(parseInt(pathArray[4]));

		return githubData;
	};

	formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
}

export default Utils;