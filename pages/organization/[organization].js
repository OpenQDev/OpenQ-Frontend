// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import contractMapping from '../../constants/contract-map.json';
import BountyCard from '../../components/BountyCard/BountyCard';

const organization = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [organizationData, setOrganizationData] = useState(null);
	const [bounties, setBounties] = useState([]);

	// Methods
	async function populateOrganizationData() {
		setIsLoading(true);
		const org = await appState.openQSubgraphClient.getOrganization(organization.toLowerCase());

		const orgData = await appState.githubRepository.fetchOrganizationByName(organization);

		const mergedOrgData = { ...org, ...orgData };
		setOrganizationData(mergedOrgData);
	}

	async function populateBountyData() {
		const bounties = organizationData.bountiesCreated;

		const bountyIds = bounties.map(bounty => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);

		const fullBounties = [];
		bounties.forEach(bounty => {
			const relatedIssue = issueData.find(issue => issue.id == bounty.bountyId);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});

		setBounties(fullBounties);

		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (organizationData) {
			populateBountyData();
		}
	}, [organizationData]);

	useEffect(() => {
		if (organization) {
			populateOrganizationData();
		}
	}, [organization]);

	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			<div>
				<h1 className='font-bold uppercase'>{organizationData.name}</h1>
				<h1 className='font-bold uppercase'>Total Contributions</h1>
				{organizationData.fundedTokenBalances.map(tokenBalance => {
					return (
						<>
							<div>Contract Address: {tokenBalance.tokenAddress}</div>
							<div>Value: {ethers.utils.formatEther(tokenBalance.volume)}</div>
							<div>Name: {contractMapping[tokenBalance.tokenAddress].name}</div>
							<div>Symbol: {contractMapping[tokenBalance.tokenAddress].symbol}</div>
						</>
					);
				})}
				<h1 className='font-bold uppercase'>Bounties Created</h1>
				{organizationData.bountiesCreated.length != 0 ? (
					organizationData.bountiesCreated.map(bounty => {
						return (
							<>
								<div>BountyId: {bounty.id}</div>
							</>
						);
					})
				) : 'No Bounties Created'}
				<h1 className='font-bold uppercase'>Bounty Contributions</h1>
				{organizationData.deposits.length != 0 ? (
					organizationData.deposits.map(deposit => {
						return (
							<>
								<div>Bounty Address: {deposit.bounty.id}</div>
								<div>Bounty Id: {deposit.bounty.bountyId}</div>
								<div>Contract Address: {deposit.tokenAddress}</div>
								<div>Value: {ethers.utils.formatEther(deposit.value)}</div>
								<div>Name: {contractMapping[deposit.tokenAddress].name}</div>
								<div>Symbol: {contractMapping[deposit.tokenAddress].symbol}</div>
							</>
						);
					})
				) : 'No Deposits on any Issues'}
				<h1 className='font-bold uppercase'>Bounties</h1>
				{bounties.length != 0 ? (
					bounties.map((bounty) => {
						return (
							<BountyCard
								bounty={bounty}
								key={bounty.bountyId}
							/>
						);
					})
				) : 'No Bounties'}
			</div>
		);
	}
};

export default organization;
