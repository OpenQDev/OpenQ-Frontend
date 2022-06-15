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
import Utils from '../../services/utils/Utils';

const organization = ({ organizationData, fullBounties, batch, renderError}) => {
	// Context
	const [appState] = useContext(StoreContext);
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [bounties, setBounties] = useState(fullBounties);
	const [showAbout, setShowAbout] = useState('Bounties');
	const [pagination, setPagination] = useState(batch);
	const [error, setError] = useState(renderError);
	const [offChainCursor, setOffChainCursor] = useState();

	const [tokenValues] = useGetTokenValues(organizationData?.fundedTokenBalances);
	const [complete, setComplete] = useState(fullBounties.length === 0);
	
	// Methods
	console.log(complete);
	async function getBountyData(sortOrder, currentPagination, orderBy,cursor) {
		setPagination(() => currentPagination + batch);
		let newBounties = [];
		if(orderBy === 'tvl'){
			console.log(orderBy);
			try{
				const prismaBounties = await appState.openQPrismaClient.getBountyPage(cursor, batch, 'tvl', sortOrder, organizationData.id);
				const addresses = prismaBounties.bountiesConnection.bounties.map(bounty=>bounty.address.toLowerCase());
				setOffChainCursor(prismaBounties.bountiesConnection.cursor);
				console.log(addresses);
				const subgraphBounties = await appState.openQSubgraphClient.getBountiesByContractAddresses(addresses);
				newBounties = prismaBounties.bountiesConnection.bounties.map((bounty)=>{return {...bounty, ...subgraphBounties.find((subgraphBounty)=>subgraphBounty.bountyAddress === bounty.address.toLowerCase())};});
				
			}
			catch(err){
				console.log(err);
			}
		}
		else{
			const subgraphBounties = await appState.openQSubgraphClient.getPaginatedOrganizationBounties(organizationData.id, currentPagination, sortOrder, batch, []);
			newBounties = subgraphBounties.bountiesCreated;
		}
		const bountyIds = newBounties.map((bounty) => bounty.bountyId);
		let issueData;
		try{
			issueData = await appState.githubRepository.getIssueData(bountyIds);}
		catch(err){
			console.log(err);
		}
		const fullBounties = appState.utils.combineBounties(newBounties, issueData);
		return fullBounties;
	}

	async function getNewData(order, orderBy) {
		console.log(orderBy);
		setIsLoading(true);
		setComplete(false);
		let newBounties;
		try {
			newBounties = await getBountyData(order, 0, orderBy);
		}
		catch (err) {
			console.log(err);
			setError(err);
			return;
		}
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(order, orderBy) {
		console.log('gettin more');
		setComplete(true);
		let newBounties;
		try {
			newBounties = await getBountyData(order, pagination, orderBy, offChainCursor);
		}
		catch (err) {
			setError(err);
			return;
		}
		console.log(newBounties.length);
		if (newBounties.length !== 0) {
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));
	}

	// Render
	return (
		<>
			{error ?
				<UnexpectedError error = {error} />
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
	const utils = new Utils();
	githubRepository.instance.setGraphqlHeaders();
	
	let orgData;
	let mergedOrgData;
	try {
		orgData = await githubRepository.instance.fetchOrgOrUserByLogin(
			organization
		);
	}
	catch (err) {
		return{props:{renderError:`Could not find ${organization}, does an organization with this name exists on Github?`}};
	}
	const org = await openQSubgraphClient.instance.getOrganization(
		orgData.id, batch
	);
	mergedOrgData = { ...org, ...orgData };	
	const bounties = mergedOrgData.bountiesCreated||[];
	const bountyIds = bounties.map((bounty) => bounty.bountyId);
	let issueData;
	try{
		issueData = await githubRepository.instance.getIssueData(bountyIds);
	}
	catch(err){
		console.log(err);
	}
	const fullBounties = utils.combineBounties(bounties, issueData);


	return  {props: {organization,  organizationData: mergedOrgData, fullBounties, completed: bounties.length<10, batch}};
};

export default organization;
