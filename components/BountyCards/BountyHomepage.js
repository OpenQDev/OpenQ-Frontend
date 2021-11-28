// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import BountyCard from './BountyCard';
import StoreContext from '../../store/Store/StoreContext';

const BountyHomepage = () => {
	// State
	const [bounties, setBounties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Context
	const [appState,] = useContext(StoreContext);

	// Hooks
	useEffect(() => {
		populateBountyData();
	}, []);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounties = await appState.openQSubgraphClient.getAllBounties();

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

	// Render
	if (isLoading) {
		return <div>Loading...</div>;
	} else {
		return (
			<>
				<div className="grid grid-cols-1 gap-6 pr-20">
					{bounties.map((bounty) => {
						console.log(bounty);
						return (
							<BountyCard
								bounty={bounty}
								key={bounty.bountyId}
							/>
						);
					})}
				</div>
			</>
		);
	}
};

export default BountyHomepage;
