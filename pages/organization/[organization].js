// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import {ethers} from'ethers';

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

	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [organizationData, setOrganizationData] = useState(null);
	const [bounties, setBounties] = useState([]);
	const [showAbout, setShowAbout] = useState('Bounties');
	const [pagination, setPagination] = useState(1);
	const [tokenValues] = useGetTokenValues(organizationData?.fundedTokenBalances);
	const [complete, setComplete] = useState(false);

	// Methods
	async function populateOrganizationData() {
		setIsLoading(true);
		const org = await appState.openQSubgraphClient.getOrganization(
			organization
		);

		const orgData = await appState.githubRepository.fetchOrganizationByName(
			organization
		);

		const mergedOrgData = { ...org, ...orgData };

		setOrganizationData(mergedOrgData);
	}



	async function getBountyData(dsc = true){
		setPagination(()=>pagination+1);
		const newBounties = await appState.openQSubgraphClient.getPaginatedOrganizationBounties(organization, pagination, dsc);
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
		if(fullBounties.length===0){
			setComplete(true);
		}
		return fullBounties;
	}

	async function getNewData (isDsc){
		setIsLoading(true);
		setComplete(false);
		const newBounties = await getBountyData(isDsc);
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(isDsc){	
		const newBounties = await getBountyData(isDsc);
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
		<div className="bg-dark-mode pt-10">
			<Toggle toggleFunc={setShowAbout} toggleVal={showAbout} names={['Bounties', 'About']} />
			{(showAbout === 'About') ?
				<About organizationData={organizationData} tokenValues={tokenValues} /> :
				<div className="grid xl:grid-cols-wide justify-center w-f pt-8">
					<LargeOrganizationCard organization={organizationData}/>
					<BountyList bounties={bounties} loading={isLoading} getBountyData={getMoreData} getNewData={getNewData} complete={complete}/>
				</div>}
		</div>
	);
	
};

export default organization;
