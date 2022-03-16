// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter, } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import AboutUser from '../../components/User/AboutUser';

const account = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { account } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	// Methods
	async function populateUserData() {
		const user = await appState.openQSubgraphClient.getUser(account.toLowerCase());
		setUser(user);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (account) {
			populateUserData();
		}
	}, [account]);

	
	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			
			<div className='text-white md:grid grid-cols-wide gap-4 justify-center col-start-2 pt-12'>
				<section className="min-h-card rounded-lg shadow-sm col-start-2 md:border border-web-gray">
					<AboutUser user={user} account={account}/>
				</section>
			</div>
		);
	}
};

export default account;
