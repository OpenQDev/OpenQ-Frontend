// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Image from 'next/image';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const account = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	const { tokenMetadata } = appState;

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
							<div>Name: {tokenMetadata[tokenBalance.tokenAddress].name}</div>
							<div>Symbol: {tokenMetadata[tokenBalance.tokenAddress].symbol}</div>
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
						const tokenAddress = ethers.utils.getAddress(deposit.tokenAddress);
						return (
							<div
								className={
									'flex flex-col p-6 font-mont rounded-xl shadow-sm bg-white cursor-pointer pr-10 pl-10'
								}
								key={deposit.bounty.bountyId}
							>
								<div>Bounty Address: {deposit.bounty.id}</div>
								<div>Bounty Id: {deposit.bounty.bountyId}</div>
								<div>Contract Address: {tokenAddress}</div>
								<div>Value: {ethers.utils.formatEther(deposit.value)}</div>
								<div>Name: {tokenMetadata[tokenAddress].name}</div>
								<div>Symbol: {tokenMetadata[tokenAddress].symbol}</div>
								<div className="pt-1">
									<Image
										src={`/cryptocurrency-icons/32/color/${tokenMetadata[tokenAddress].symbol}.png`}
										alt="n/a"
										width="16"
										height="16"
									/>
								</div>
							</div>
						);
					})
				) : 'No Bounties Created'}
				<h1 className='font-bold uppercase'>Buy a Coffee for this User Button</h1>
			</div>
		);
	}
};

export default account;
