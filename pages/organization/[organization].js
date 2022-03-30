// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import GithubDown from '../../components/Utils/GithubDown';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyList from '../../components/Bounty/BountyList';
import LargeOrganizationCard from '../../components/Organization/LargeOrganizationCard';
import Toggle from '../../components/Toggle/Toggle';
import About from '../../components/About/About';
import useGetTokenValues from '../../hooks/useGetTokenValues';
const organization = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	const batch=3;
	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [organizationData, setOrganizationData] = useState(null);
	const [bounties, setBounties] = useState();
	const [showAbout, setShowAbout] = useState('Bounties');
	const [pagination, setPagination] = useState(batch);
	const [githubOutage, setGithubOutage] = useState(false);

	const [tokenValues] = useGetTokenValues(organizationData?.fundedTokenBalances);
	const [complete, setComplete] = useState(false);
	// Methods
	async function populateOrganizationData() {
		setIsLoading(true);
		let orgData;
		try {
			orgData = await appState.githubRepository.fetchOrganizationByName(
				organization
			);
		}
		catch (err) {
			setGithubOutage(true);
		}

		const org = await appState.openQSubgraphClient.getOrganization(
			orgData.id, batch
		);
		const mergedOrgData = { ...org, ...orgData };
		setOrganizationData(mergedOrgData);
	}



	async function getBountyData(order, currentPagination){
		setPagination(()=>currentPagination+batch);
		const newBounties = await appState.openQSubgraphClient.getPaginatedOrganizationBounties(organizationData.id, currentPagination, order, batch);
		const bountyIds = newBounties.bountiesCreated.map((bounty) => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);
		const fullBounties = [];
		newBounties.bountiesCreated.forEach((bounty) => {
			const relatedIssue = issueData.find(
				(issue) => issue.id == bounty.bountyId
			);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});
		return fullBounties;
	}

	async function getNewData (order){
		setIsLoading(true);
		setComplete(false);
		const newBounties = await getBountyData(order, 0);
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(order){
		setComplete(true);
		const newBounties = await getBountyData(order, pagination);
		if(newBounties.length === batch){
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));	
	}

	async function populateBountyData() {
		const bounties = organizationData.bountiesCreated;
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
	return (
		<>
			{githubOutage ?
				<GithubDown />
				:
				<div className="bg-dark-mode pt-10">
					<Toggle toggleFunc={setShowAbout} toggleVal={showAbout} names={['Bounties', 'About']} />
					{(showAbout === 'About') ?
						<About organizationData={organizationData} tokenValues={tokenValues} /> :
						<div className="sm:grid px-4 xl:grid-cols-wide justify-center w-f pt-8 gap-4">
							<LargeOrganizationCard organization={organizationData} />
							<BountyList bounties={bounties}  loading={isLoading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
						</div>}
				</div>
			}
		</>
	);

};

export default organization;
