// Third party
import React, { useState, useContext } from 'react';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import Utils from '../../services/utils/Utils';
import useAuth from '../../hooks/useAuth';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import OrganizationHeader from '../../components/Organization/OrganizationHeader';
import SubMenu from '../../components/Utils/SubMenu';
import Home from '../../components/svg/home';
import OrganizationMetadata from '../../components/Organization/OrganizationMetadata';
import OrganizationContent from '../../components/Organization/OrganizationContent';


const organization = ({ organizationData, fullBounties, batch, renderError }) => {
	const types =['1', '2','3'];
	useAuth();
	// Context
	const [appState] = useContext(StoreContext);
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [bounties, setBounties] = useState(fullBounties);
	const [pagination, setPagination] = useState(batch);
	const [error, setError] = useState(renderError);
	const [offChainCursor, setOffChainCursor] = useState();
	const [toggleVal, setToggleVal] = useState('Overview');
	const [complete, setComplete] = useState(fullBounties?.length === 0);
	

	// Methods
	async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
		setPagination(() => currentPagination + batch);
		let newBounties = [];
		if (orderBy === 'tvl') {
			try {
				const prismaBounties = await appState.openQPrismaClient.getBountyPage(cursor, batch, 'tvl', sortOrder,types, organizationData.id);
				const addresses = prismaBounties.bountiesConnection.bounties.map(bounty => bounty.address.toLowerCase());
				setOffChainCursor(prismaBounties.bountiesConnection.cursor);
				const subgraphBounties = await appState.openQSubgraphClient.getBountiesByContractAddresses(addresses);
				newBounties = prismaBounties.bountiesConnection.bounties.map((bounty) => { return { ...bounty, ...subgraphBounties.find((subgraphBounty) => subgraphBounty.bountyAddress === bounty.address.toLowerCase()) }; });

			}
			catch (err) {
				console.log('could not fetch watched bounties');
			}
		}
		else {
			const subgraphBounties = await appState.openQSubgraphClient.getPaginatedOrganizationBounties(organizationData.id, currentPagination, sortOrder, batch, []);
			newBounties = subgraphBounties;
		}
		const bountyIds = newBounties.map((bounty) => bounty.bountyId);
		let issueData;
		try {
			issueData = await appState.githubRepository.getIssueData(bountyIds);
		}
		catch (err) {
			console.log(err);
		}
		const fullBounties = appState.utils.combineBounties(newBounties, issueData);
		return fullBounties;
	}

	async function getNewData(order, orderBy) {
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
		setComplete(true);
		let newBounties;
		try {
			newBounties = await getBountyData(order, pagination, orderBy, offChainCursor);
		}
		catch (err) {
			setError(err);
			return;
		}
		if (newBounties.length !== 0) {
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));
	}
	const handleToggle = (toggleVal)=>{
		setToggleVal(toggleVal);
	};
	const repositories = bounties.reduce((repositories, bounty)=>{
		if (repositories.some(repo=>repo.name===bounty.repoName)){
			return repositories;
		}
		return [...repositories, {name: bounty.repoName, languages: bounty.languages, description: bounty.repoDescription, url: bounty.repoUrl}];
	
	},[]);
	// Render
	return (
		<>
			{error ?
				<UnexpectedError error={error} />
				:
				<div className='w-full mx-auto text-primary mt-1 px-4 md:px-16 max-w-[1420px] '>
					<OrganizationHeader colour="rust"  organizationData={organizationData} />
					<SubMenu  items={[{name: 'Overview', Svg: Home },/*{name: 'About', Svg: Question }*/]} internalMenu={toggleVal} updatePage={handleToggle}/>
					{toggleVal === 'Overview' && <div className='px-4 py-3 gap-6 w-full flex flex-wrap md:flex-nowrap'>
						<OrganizationContent  bounties={bounties} loading={isLoading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} repositories={repositories}/>
						<OrganizationMetadata organizationData={organizationData} repositories={repositories}/>
					</div>}
				</div>}
		</>
	);

};

export const getServerSideProps = async (context) => {
	const batch = 10;
	const { organization } = context.params;
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient;
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
		return { props: { renderError: `Could not find ${organization}, does an organization with this name exists on Github?` } };
	}
	const org = await openQSubgraphClient.instance.getOrganization(
		orgData.id, batch
	);
	mergedOrgData = { ...org, ...orgData };
	const bounties = mergedOrgData.bountiesCreated || [];
	const bountyIds = bounties.map((bounty) => bounty.bountyId);
	const bountyAddresses = bounties.map((bounty)=>bounty.bountyAddress);
	let issueData;
	let metaData;
	try {
		issueData = await githubRepository.instance.getIssueData(bountyIds);
		metaData = await openQPrismaClient.instance.getBlackListed(bountyAddresses);
	}
	catch (err) {
		console.log(err);
	}
	const fullBounties = utils.combineBounties(bounties, issueData, metaData);

	return { props: { organization, organizationData: mergedOrgData, fullBounties, completed: bounties.length < 10, batch } };
};

export default organization;
