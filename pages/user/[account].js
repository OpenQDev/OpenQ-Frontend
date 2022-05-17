// Third party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter, } from 'next/router';
const { ethers } = require('ethers');

// Custom
import StoreContext from '../../store/Store/StoreContext';
import AboutUser from '../../components/User/AboutUser';
import UnexpectedError from '../../components/Utils/UnexpectedError';

const account = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { account } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(false);

	// Methods
	async function populateUserData() {
		try {
			const userOnChainData = await appState.openQSubgraphClient.getUser(account.toLowerCase());
			
			console.log('userOnChainData', userOnChainData);

			const userOffChainData = await appState.openQPrismaClient.getUser(ethers.utils.getAddress(account));
			
			console.log('userOffChainData', userOffChainData);
			
			const user = (userOnChainData||userOffChainData)?{ ...userOnChainData, ...userOffChainData }: null;
			
			if(user){
				setUser(user);}
			else{
				try{
					ethers.utils.getAddress(account);				
					setUser({
						bountiesClosed:[],
						bountiesCreated: [],
						deposits: [],
						fundedTokenBalances: [],
						id: account.toLowerCase(),
						payoutTokenBalances: [],
						payouts: [],
					});
				}
				catch(err)
				{
					console.log(err);
				}
			}
			setIsLoading(false);
		}
		catch (err) {
			setError(true);
			console.log('error is', error);
			return;
		}
	}

	// Hooks
	useEffect(() => {
		if (account) {
			console.log('account', account);
			populateUserData();

		}
	}, [account]);


	// Render
	if (isLoading) {
		return 'Loading...';
	}
	if (error) {
		return <UnexpectedError />;
	} else {
		return (

			<div className=' md:grid grid-cols-wide gap-4 justify-center col-start-2 pt-12'>
				<section className="min-h-card rounded-lg shadow-sm col-start-2 md:border border-web-gray">
					{user ?
						<AboutUser user={user} account={account} /> :
						<UnexpectedError />}
				</section>
			</div>
		);
	}
};

export default account;
