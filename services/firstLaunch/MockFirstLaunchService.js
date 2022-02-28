const MockFirstLaunchService = () => {
	let firstLaunch;
	if (typeof window !== 'undefined') {
		firstLaunch = false;
	}
	return firstLaunch;
};
export default MockFirstLaunchService;