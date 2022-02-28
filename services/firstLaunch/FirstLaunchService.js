const FirstLaunchService = () => {
	let firstLaunch;
	if (typeof window !== 'undefined') {
		firstLaunch = localStorage.getItem('firstLaunch');
		localStorage.setItem('firstLaunch', true);
	}
	return firstLaunch;
};
export default FirstLaunchService; 