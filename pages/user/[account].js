// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';

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
		console.log(user);
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
			<div>
				<h1 className='font-bold uppercase'>{account}</h1>
				<h1 className='font-bold uppercase'>Total Contributions</h1>
				{user.totalFundedTokenBalance.map(tokenBalance => {
					return (
						<>
							<div>Contract Address: {tokenBalance.id}</div>
							<div>Value: this is not working yet</div>
							{/* <div>Symbol: {contractMapping[tokenBalance.id.toLowerCase()].symbol}</div>
							<div>Name: {contractMapping[tokenBalance.id.toLowerCase()].symbol}</div> */}
						</>
					);
				})}
				<h1 className='font-bold uppercase'>Bounties Completed</h1>
				<h1 className='font-bold uppercase'>Bounties Created</h1>
				<h1 className='font-bold uppercase'>Bounties Funded</h1>
				<h1 className='font-bold uppercase'>Buy a Coffee for this User Button</h1>
			</div>
		);
	}
};

export default account;
