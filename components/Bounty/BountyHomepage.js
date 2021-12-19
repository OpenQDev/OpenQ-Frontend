// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import BountyCard from './BountyCard';
import StoreContext from '../../store/Store/StoreContext';

const BountyHomepage = () => {
	// State
	const [bounties, setBounties] = useState([]);
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
	const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);

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

	const filterByOrg = (e) => {
		setOrganizationSearchTerm(e.target.value);
	};

	const filterByIssueTitle = (e) => {
		setIssueTitleSearchTerm(e.target.value);
	};

	// Render
	if (isLoading) {
		return <div>Loading...</div>;
	} else {
		return (
			<>
				<div className="grid grid-cols-1 gap-6 pr-20">
					<div>Organization</div>
					<input
						className="outline-none rounded-lg py-2 p-5 text-base bg-gray-100 shadow-inner text-black w-1/5"
						onKeyUp={(e) => filterByOrg(e)}
						type="text"
						placeholder="Search for Organizations"
					></input>
					<div>Issue Title</div>
					<input
						className="outline-none rounded-lg py-2 p-5 text-base bg-gray-100 shadow-inner text-black w-1/5"
						onKeyUp={(e) => filterByIssueTitle(e)}
						type="text"
						placeholder="Search for Issues"
					></input>
					{bounties
						.filter((bounty) => {
							return organizationSearchTerm
								? bounty.owner
									.toLowerCase()
									.indexOf(organizationSearchTerm.toLowerCase()) > -1
								: bounty;
						})
						.filter((bounty) => {
							return issueTitleSearchTerm
								? bounty.title
									.toLowerCase()
									.indexOf(issueTitleSearchTerm.toLowerCase()) > -1
								: bounty;
						})
						.map((bounty) => {
							return <BountyCard bounty={bounty} key={bounty.bountyId} />;
						})}
				</div>
			</>
		);
	}
};

export default BountyHomepage;
