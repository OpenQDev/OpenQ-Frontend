class Utils {
	constructor() { }

	formatDate = (createdAt) => {
		const rawDate = createdAt;
		const date = new Date(rawDate);
		return date.toDateString().split(' ').slice(1).join(' ');
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