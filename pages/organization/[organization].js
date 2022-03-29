// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import {ethers} from'ethers';
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

	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [organizationData, setOrganizationData] = useState(null);
	const [bounties, setBounties] = useState([]);
	const [showAbout, setShowAbout] = useState('Bounties');
	const [pagination, setPagination] = useState(2);
	const [githubOutage, setGithubOutage] = useState(false);

	const [tokenValues] = useGetTokenValues(organizationData?.fundedTokenBalances);
	const [complete, setComplete] = useState(false);
	const batch=2;
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
			orgData.id
		);
		const mergedOrgData = { ...org, ...orgData };
		setOrganizationData(mergedOrgData);
	}



	async function getBountyData(order){
		setPagination(()=>pagination+batch);
		console.log(organizationData.id);
		console.log(organization, pagination, order, batch);
		const newBounties = await appState.openQSubgraphClient.getPaginatedOrganizationBounties(organizationData.id, pagination, order, batch);
		console.log(newBounties);
		console.log(bounties);
		console.log(pagination);
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
		const newBounties = await getBountyData(order);
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(order){
		setComplete(true);
		const newBounties = await getBountyData(order);
		if(pagination===14){
			console.log('exec');
			return;
		}
		setComplete(false);
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
						<div className="grid xl:grid-cols-wide justify-center w-f pt-8">
							<LargeOrganizationCard organization={organizationData} />
							<BountyList bounties={bounties} loading={isLoading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
						</div>}
				</div>
			}
		</>
	);

};

export default organization;
