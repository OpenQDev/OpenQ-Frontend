// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import useWeb3 from '../hooks/useWeb3';
import useAuth from '../hooks/useAuth';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';
import SubMenu from '../components/Utils/SubMenu';
import UnexpectedError from '../components/Utils/UnexpectedError';

export default function Index({ orgs, fullBounties, batch, types, renderError }) {
	useAuth();

	// State
	const [internalMenu, setInternalMenu] = useState('Issues');
	const [controlledOrgs, setControlledOrgs] = useState(orgs);
	const [bounties, setBounties] = useState(fullBounties);
	const [isLoading, setIsLoading] = useState(false);
	const [complete, setComplete] = useState(false);
	const [pagination, setPagination] = useState(batch);
	const [offChainCursor, setOffChainCursor] = useState();
	const [watchedBounties, setWatchedBounties] = useState([]);

	// Context
	const [appState,] = useContext(StoreContext);
	const {reloadNow} = appState;
	const { account } = useWeb3();


	const [authState] = useAuth();
	const {signedAccount} = authState;
	
	// Hooks
	useEffect(async()=>{
		// handle org reload events (caused by user starring org.)
		if(reloadNow){		
			const [mergedOrgs] = await appState.utils.fetchOrganizations(appState, types);
			setControlledOrgs(mergedOrgs);
			// get watched bounties when reload action is triggered.
		
		}

	},[reloadNow]);

	useEffect(async () => {
		// get watched bounties as soon as we know what the account is.
		if (account == signedAccount) {
			const [watchedBounties ]= await appState.utils.fetchWatchedBounties(appState, account, types);
			setWatchedBounties(watchedBounties||[]);
		}
		else{
			setWatchedBounties([]);
		}

	}, [account, reloadNow, signedAccount]);

	// Methods

	// General method for getting bounty data, used by pagination and handlers.
	async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
		setPagination(() => currentPagination + batch);
		let newBounties = [];
		let complete = false;
		if (orderBy) {
			try {
				const prismaBounties = await appState.openQPrismaClient.getBountyPage(
					cursor,
					batch,
					'tvl',
					sortOrder,
					types
				);
				if(prismaBounties.length===0){
					complete = true;
				}
				const addresses = prismaBounties.bountiesConnection.bounties.map(
					(bounty) => bounty.address.toLowerCase()
				);
				setOffChainCursor(prismaBounties.bountiesConnection.cursor);
				const subgraphBounties =
          await appState.openQSubgraphClient.getBountiesByContractAddresses(addresses);
        
				newBounties = prismaBounties.bountiesConnection.bounties.map(
					(bounty) => {
						return {
							...bounty,
							...subgraphBounties.find(
								(subgraphBounty) =>
									subgraphBounty.bountyAddress === bounty.address.toLowerCase()
							),
						};
					}
				);
			} catch (err) {
				console.log(err);
			}
		} else {
		// handle un sort by tvl
			try {
				newBounties = await appState.openQSubgraphClient.getAllBounties(
					sortOrder,
					currentPagination,
					batch,
					types
				);
			} catch (err) {
				console.log('no bounties');
			}
		}
		console.log(newBounties.length);
		if(newBounties?.length===0){
			complete = true;}
		const [fullBounties] = await  appState.utils.fillBountiesFromBountyAddresses(newBounties, appState.openQPrismaClient, appState.githubRepository);
		
		return [fullBounties, complete];
	}

	// Pagination handler for when user switches sort order.
	async function getNewData(order, orderBy) {
		setIsLoading(true);
		setComplete(false);
		let newBounties = [];
		[newBounties] = await getBountyData(order, 0, orderBy);
		setBounties(newBounties);
		setIsLoading(false);
	}

	// Pagination handler for when user just needs another page of the same sort order.
	async function getMoreData(order, orderBy) {
		setComplete(true);
		const [newBounties, complete] = await getBountyData(
			order,
			pagination,
			orderBy,
			offChainCursor
		);
		if (!complete) {
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));
	}

	return (
		<main className="bg-dark-mode flex-col">
			<div className="flex justify-center">
				<SubMenu updatePage={setInternalMenu} internalMenu={internalMenu} 
					styles={'justify-center'}
					items={[ {name: 'Issues'},{name: 'Organizations'}]}/>
				
			</div>
			<div>
				{
				
					renderError?
						<UnexpectedError error={renderError}/>:

						internalMenu == 'Organizations' ? (
							<OrganizationHomepage orgs={controlledOrgs} />
						) : (
							<BountyHomepage
								type={types}
								bounties={bounties}
								watchedBounties={watchedBounties}
								loading={isLoading}
								getMoreData={getMoreData}
								complete={complete}
								getNewData={getNewData}
							/>
						)}
			</div>
		</main>
	);
}

export const getServerSideProps = async (ctx) => {
	let types =['0','1', '2'];

	switch(ctx?.query?.type){
	case 'atomic-contracts':
		types=['0'];
		break;
	case 'contests':
		types=['2'];
		break;
	case 'repeatable':
		types=['1'];
		break;


	}

	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	const utils = new Utils();
	githubRepository.instance.setGraphqlHeaders();
	const batch = 10;
	
	const [mergedOrgs, orgRenderError] =await utils.fetchOrganizations({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance}, types);
	const [fullBounties, bountyRenderError] = await utils.fetchBounties({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance}, types, batch);
	const renderError = bountyRenderError||orgRenderError;
	return {
		props: {
			orgs: mergedOrgs,
			fullBounties,
			renderError,
			batch,
			types
		},
	};
};
