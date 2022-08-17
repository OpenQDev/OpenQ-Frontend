// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import useWeb3 from '../hooks/useWeb3';
import useAuth from '../hooks/useAuth';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';
import UnexpectedError from '../components/Utils/UnexpectedError';

export default function Index({  fullBounties, batch, types, renderError }) {
	
	// State
	
	const [bounties, setBounties] = useState(fullBounties);
	const [isLoading, setIsLoading] = useState(false);
	const [complete, setComplete] = useState(false);
	const [pagination, setPagination] = useState(batch);
	const [offChainCursor, setOffChainCursor] = useState();
	const [watchedBounties, setWatchedBounties] = useState([]);

	// Context
	const [appState] = useContext(StoreContext);
	const {reloadNow} = appState;
	const { account } = useWeb3();
	const [authState] = useAuth();
	const {signedAccount} = authState;
	// Hooks

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
					orderBy,
					sortOrder,
					types
				);
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
				console.log('complete');
			}
		} else {
			try {
				newBounties = await appState.openQSubgraphClient.getAllBounties(
					sortOrder,
					currentPagination,
					batch, types
				);
			} catch (err) {
				console.log('no bounties');
			}
		}
		
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
			{renderError ?
				<UnexpectedError error={renderError}/>
				:
				<BountyHomepage
					types={types}
					bounties={bounties}
					watchedBounties={watchedBounties}
					loading={isLoading}
					getMoreData={getMoreData}
					complete={complete}
					getNewData={getNewData}
					wizard={true}
				/>}
				
		</main>
	);
}

export const getServerSideProps = async () => {
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	const utils = new Utils();
	githubRepository.instance.setGraphqlHeaders();
	const batch = 10;
	const types=['0','1','2'];
	
	const [fullBounties, renderError] = await utils.fetchBounties({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance}, types, batch);
	return {
		props: {
			fullBounties,
			renderError,
			batch,
			types
		},
	};
};
