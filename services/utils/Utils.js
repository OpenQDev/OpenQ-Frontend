class Utils {
	constructor() { }

	monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	formatUnixDate = (unixTime) => {
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
		var formattedTime = `${month} ${day}, ${year} at ${hours}:${minutes.substr(-2) + ':' + seconds.substr(-2)}`;
		return formattedTime;
	};

	formatDate = (createdAt) => {
		return this.formatUnixDate(new Date(createdAt).getTime() / 1000);
	};

	issurUrlRegex = (issueUrl) => {
		const pattern = /https?:\/\/github\.com\/(?:[^\/\s]+\/)+(?:issues\/\d+)/;
		return pattern.test(issueUrl);
	};

	formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
}

export default Utils;