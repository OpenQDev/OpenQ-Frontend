// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyList from './BountyList';

const BountyHomepage = () => {
	// State
	const [bounties, setBounties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(0);

	// Context
	const [appState] = useContext(StoreContext);

	// Hooks
	useEffect(() => {
		populateBountyData();
	}, []);

	// Methods
	
	async function getBountyData() {
		console.log('page');
		const fetchedBounties = await appState.openQSubgraphClient.getAllBounties(10*page);

		const bountyIds = fetchedBounties.map((bounty) => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);

		const fullBounties = [];
		fetchedBounties.forEach((bounty) => {
			const relatedIssue = issueData.find(
				(issue) => issue.id == bounty.bountyId
			);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});
		console.log(fullBounties);
		console.log(bounties);
		setBounties(fullBounties.concat(bounties));
		setPage(()=>page+1);
	}

	async function populateBountyData() {
		setIsLoading(true);
		await getBountyData();
		setIsLoading(false);
	}

	
	

	// Render
	return (
		<div className="grid xl:grid-cols-wide justify-center">
			<BountyList bounties={bounties} loading={isLoading} getBountyData={getBountyData}/>
		</div>
	);
};

export default BountyHomepage;
