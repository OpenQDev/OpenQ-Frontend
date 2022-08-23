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

export default function Index({ orgs, fullBounties, batch, types, category, renderError, firstCursor }) {
	useAuth();

	// State
	const [internalMenu, setInternalMenu] = useState('Issues');
	const [controlledOrgs, setControlledOrgs] = useState(orgs);
	const [bounties, setBounties] = useState(fullBounties);
	const [isLoading, setIsLoading] = useState(false);
	const [complete, setComplete] = useState(false);
	const [pagination, setPagination] = useState(batch);
	const [offChainCursor, setOffChainCursor] = useState(firstCursor);
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
			const [mergedOrgs] = await appState.utils.fetchOrganizations(appState,  category);
			setControlledOrgs(mergedOrgs);
			// get watched bounties when reload action is triggered.
		
		}

	},[reloadNow]);

	useEffect(async () => {
		// get watched bounties as soon as we know what the account is.
		if (account == signedAccount && account) {
			const [watchedBounties ]= await appState.utils.fetchWatchedBounties(appState, account, category, types);
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
		let complete = false;
		const [fullBounties, newCursor] = await appState.utils.fetchBounties(appState, batch, category, orderBy, sortOrder, cursor);
		setOffChainCursor(newCursor);
		if(fullBounties?.length===0){
			complete = true;
		}
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
							<OrganizationHomepage orgs={controlledOrgs} types={types} category={category}/>
						) : (
							<BountyHomepage
								category={category}
								bounties={bounties}
								watchedBounties={watchedBounties}
								loading={isLoading}
								getMoreData={getMoreData}
								complete={complete}
								getNewData={getNewData}
								types={types}
							/>
						)}
			</div>
		</main>
	);
}

export const getServerSideProps = async (ctx) => {
	let types =['0','1', '2', '3'];
	let category = null;
	switch(ctx?.query?.type){
	case 'prime':
		types=['0'];
		category='prime';
		break;
	case 'contests':
		types=['2', '3'];
		category='contest';
		break;
	case 'learn2earn':
		category='learn2earn';

		types=['1'];
		break;
	}

	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	const utils = new Utils();
	githubRepository.instance.setGraphqlHeaders();
	const batch = 10;
	const sortOrder = 'desc';
	const [mergedOrgs, orgRenderError] =await utils.fetchOrganizations({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance},category,  category, sortOrder);
	const [fullBounties, firstCursor, bountyRenderError] = await utils.fetchBounties({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance}, batch, category);
	const renderError = bountyRenderError||orgRenderError;
	return {
		props: {
			orgs: mergedOrgs,
			fullBounties,
			renderError,
			batch,
			types,
			category,
			firstCursor
		},
	};
};
