// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import contractMapping from '../../constants/contract-map.json';

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
				{user.fundedTokenBalances.map(tokenBalance => {
					return (
						<>
							<div>Contract Address: {tokenBalance.tokenAddress}</div>
							<div>Value: {ethers.utils.formatEther(tokenBalance.volume)}</div>
							<div>Name: {contractMapping[tokenBalance.tokenAddress.toLowerCase()].name}</div>
							<div>Symbol: {contractMapping[tokenBalance.tokenAddress.toLowerCase()].symbol}</div>
						</>
					);
				})}
				<h1 className='font-bold uppercase'>Bounties Completed</h1>
				{user.bountiesClosed.length != 0 ? (
					user.bountiesClosed.map(bounty => {
						return (
							<>
								<div>BountyId: {bounty.id}</div>
							</>
						);
					})
				) : 'No Bounties Completed'}
				<h1 className='font-bold uppercase'>Bounties Created</h1>
				{user.bountiesCreated.length != 0 ? (
					user.bountiesCreated.map(bounty => {
						return (
							<>
								<div>BountyId: {bounty.id}</div>
							</>
						);
					})
				) : 'No Bounties Created'}
				<h1 className='font-bold uppercase'>Bounty Contributions</h1>
				{user.deposits.length != 0 ? (
					user.deposits.map(deposit => {
						return (
							<>
								<div>Bounty Id: {deposit.bounty.id}</div>
								<div>Contract Address: {deposit.tokenAddress}</div>
								<div>Value: {ethers.utils.formatEther(deposit.value)}</div>
								<div>Name: {contractMapping[deposit.tokenAddress.toLowerCase()].name}</div>
								<div>Symbol: {contractMapping[deposit.tokenAddress.toLowerCase()].symbol}</div>
							</>
						);
					})
				) : 'No Bounties Created'}
				<h1 className='font-bold uppercase'>Buy a Coffee for this User Button</h1>
			</div>
		);
	}
};

export default account;
