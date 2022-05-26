// Third party
import React, { useState, useContext } from 'react';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import BountyList from '../../components/Bounty/BountyList';
import LargeOrganizationCard from '../../components/Organization/LargeOrganizationCard';
import Toggle from '../../components/Toggle/Toggle';
import About from '../../components/About/About';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
const organization = ({ organizationData, fullBounties, completed, batch}) => {
	// Context
	const [appState] = useContext(StoreContext);
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [bounties, setBounties] = useState(fullBounties);
	const [showAbout, setShowAbout] = useState('Bounties');
	const [pagination, setPagination] = useState(batch);
	const [error, setError] = useState(false);

	const [tokenValues] = useGetTokenValues(organizationData?.fundedTokenBalances);
	const [complete, setComplete] = useState(completed);
	// Methods

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
						<div className="lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center pt-8">
							<LargeOrganizationCard organization={organizationData} />
							<BountyList bounties={bounties} loading={isLoading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
						</div>}
				</div>
			}
		</>
	);

};

export const getServerSideProps = async(context) =>{
	const batch=10;
	const {organization} = context.params;
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	githubRepository.instance.setGraphqlHeaders();
	
	let orgData;
	let mergedOrgData;
	try {
		orgData = await githubRepository.instance.fetchOrgOrUserByLogin(
			organization
		);

		const org = await openQSubgraphClient.instance.getOrganization(
			orgData.id, batch
		);
		mergedOrgData = { ...org, ...orgData };
	}
	catch (err) {
		console.log(err);
	}
	
	const bounties = mergedOrgData.bountiesCreated;
	const bountyIds = bounties.map((bounty) => bounty.bountyId);
	const issueData = await githubRepository.instance.getIssueData(bountyIds);
	console.log(issueData);
	const fullBounties = [];
	bounties.forEach((bounty) => {
		const relatedIssue = issueData.find(
			(issue) => issue.id == bounty.bountyId
		) || { id: '', title: '', body: '' };
		const mergedBounty = { ...bounty, ...relatedIssue };
		fullBounties.push(mergedBounty);
	});


	return  {props: {organization,  organizationData: mergedOrgData, fullBounties, completed: bounties.length<10, batch}};
};

export default organization;
