import { useState, useEffect } from 'react';

const useCheckFirstLaunch = () => {
	const [isFirstLaunch, setIsFirstLaunch] = useState(false);

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_DEPLOY_ENV == 'local') {
			setIsFirstLaunch(false);
		} else {
			let firstLaunch;
			if (typeof window !== 'undefined' && !firstLaunch) {
				firstLaunch = localStorage.getItem('firstLaunch');
				localStorage.setItem('firstLaunch', false);
			}
			setIsFirstLaunch(firstLaunch == null);
		}
	}, []);

	return [isFirstLaunch, setIsFirstLaunch];
};

export default useCheckFirstLaunch;