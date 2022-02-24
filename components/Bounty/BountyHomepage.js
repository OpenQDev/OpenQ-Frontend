// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import BountyCard from './BountyCard';
import StoreContext from '../../store/Store/StoreContext';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';
import BountyList from './BountyList';

const BountyHomepage = () => {
	// State
	const [bounties, setBounties] = useState([]);
	const [pageNumber,] = useState(0);
	const [organizationSearchTerm] = useState('');
	const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	// Constants
	const bountiesPerPage = 10;
	const bountiesVisited = pageNumber * bountiesPerPage;

	// Context
	const [appState] = useContext(StoreContext);

	// Hooks
	useEffect(() => {
		populateBountyData();
	}, []);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounties = await appState.openQSubgraphClient.getAllBounties();

		const bountyIds = bounties.map((bounty) => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);

		const fullBounties = [];
		bounties.forEach((bounty) => {
			const relatedIssue = issueData.find(
				(issue) => issue.id == bounty.bountyId
			);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});

		setBounties(fullBounties);

		setIsLoading(false);
	}

	const filterByIssueTitle = (e) => {
		setIssueTitleSearchTerm(e.target.value);
	};

	// Render
	return (
		<div className="flex justify-center items-center">
			<div className="grid grid-cols-3 gap-3">
				<MintBountyButton />

				{isLoading ? null :
					<BountyList bounties={bounties} />}
			</div>
		</div>
	);
};

export default BountyHomepage;
