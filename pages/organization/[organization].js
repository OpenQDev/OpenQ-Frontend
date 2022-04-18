// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import BountyList from '../../components/Bounty/BountyList';
import LargeOrganizationCard from '../../components/Organization/LargeOrganizationCard';
import Toggle from '../../components/Toggle/Toggle';
import About from '../../components/About/About';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useAuth from '../../hooks/useAuth';
const organization = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	useAuth();
	const batch = 10;
	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [organizationData, setOrganizationData] = useState(null);
	const [bounties, setBounties] = useState();
	const [showAbout, setShowAbout] = useState('Bounties');
	const [pagination, setPagination] = useState(batch);
	const [error, setError] = useState(false);

	const [tokenValues] = useGetTokenValues(organizationData?.fundedTokenBalances);
	const [complete, setComplete] = useState(false);
	// Methods
	async function populateOrganizationData() {
		setIsLoading(true);
		let orgData;
		try {
			orgData = await appState.githubRepository.fetchOrgOrUserByLogin(
				organization
			);

			const org = await appState.openQSubgraphClient.getOrganization(
				orgData.id, batch
			);
			const mergedOrgData = { ...org, ...orgData };
			setOrganizationData(mergedOrgData);
		}
		catch (err) {
			console.log(error);
			setError(true);
		}

	}

	async function getBountyData(order, currentPagination) {
		setPagination(() => currentPagination + batch);
		const newBounties = await appState.openQSubgraphClient.getPaginatedOrganizationBounties(organizationData.id, currentPagination, order, batch);
		const bountyIds = newBounties.bountiesCreated.map((bounty) => bounty.bountyId);
		let issueData;
		issueData = await appState.githubRepository.getIssueData(bountyIds);
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

	async function getNewData(order) {
		setIsLoading(true);
		setComplete(false);
		let newBounties;
		try {
			newBounties = await getBountyData(order, 0);
		}
		catch (err) {
			setError(true);
			return;
		}
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(order) {
		setComplete(true);
		let newBounties;
		try {
			newBounties = await getBountyData(order, pagination);
		}
		catch (err) {
			setError(true);
			return;
		}
		if (newBounties.length === batch) {
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));
	}
	async function populateBountyData() {
		setComplete(true);
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
		if (fullBounties.length === batch) {
			setComplete(false);
		}
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
			{error ?
				<UnexpectedError />
				:
				<div className="bg-dark-mode pt-10">
					<Toggle toggleFunc={setShowAbout} toggleVal={showAbout} names={['Bounties', 'About']} />
					{(showAbout === 'About') ?
						<About organizationData={organizationData} tokenValues={tokenValues} /> :
						<div className="lg:grid lg:grid-cols-extra-wide mx-16 xl:grid-cols-wide justify-center pt-8">
							<LargeOrganizationCard organization={organizationData} />
							<BountyList bounties={bounties} loading={isLoading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
						</div>}
				</div>
			}
		</>
	);

};

export default organization;
