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

export default function Index({ orgs, fullBounties, batch }) {
	useAuth();
	const [internalMenu, setInternalMenu] = useState('Organizations');
	const [controlledOrgs, setControlledOrgs] = useState(orgs);
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

	useEffect(async()=>{
		if(reloadNow){let orgs = [];
			try {
				orgs = await appState.openQSubgraphClient.getOrganizations();
			} catch (error) {
				console.log(error);
			}
			const ids = orgs.map((org) => org.id);
			let githubOrganizations = [];
			let orgMetadata = [];
			try{	
				orgMetadata = await appState.openQPrismaClient.getOrgsMetadata(ids);
			}

			catch(error){
				console.log(error);
			}
			try {
				githubOrganizations = await appState.githubRepository.fetchOrgsOrUsersByIds(
					ids
				);
			} catch (error) {
				console.log(error);
			}
			const mergedOrgs = orgs.map((org) => {
				let currentGithubOrg;
				let currentMetadatum={};
				for (const orgMetadatum of orgMetadata) {
					if (org.id === orgMetadatum.id) {
						currentMetadatum = orgMetadatum;
					}
				}
				for (const githubOrganization of githubOrganizations) {
					if (org.id === githubOrganization.id) {
						currentGithubOrg = githubOrganization;
					}
				}
				return { ...currentMetadatum, ...org, ...currentGithubOrg };
			}).filter((org)=>{
	
				return !org.blacklisted;
			});



			setControlledOrgs(mergedOrgs);

		}
	},[reloadNow]);
	// Hooks
	useEffect(async () => {
		if (account) {
			try {
				const prismaBounties = await appState.openQPrismaClient.getUser(
					account
				);
				const watchedBountyAddresses = prismaBounties.watchedBountyIds.map(
					(address) => address.toLowerCase()
				);
				const subgraphBounties =
          await appState.openQSubgraphClient.getBountiesByContractAddresses(watchedBountyAddresses);
				const githubIds = subgraphBounties.map((bounty) => bounty.bountyId);
				const githubBounties = await appState.githubRepository.getIssueData(
					githubIds
				);
				setWatchedBounties(
					subgraphBounties.map((bounty, index) => {
						return { ...bounty, ...githubBounties[index] };
					})
				);
			} catch (err) {
				console.log(err);
				console.log('could not fetch watched bounties');
			}
		}
	}, [account]);

	// Methods
	async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
		setPagination(() => currentPagination + batch);
		let newBounties = [];

		// handle sort by tvl
		if (orderBy === 'tvl') {
			try {
				const prismaBounties = await appState.openQPrismaClient.getBountyPage(
					cursor,
					batch,
					'tvl',
					sortOrder
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
					batch
				);
			} catch (err) {
				console.log('no bounties');
			}
		}
		const bountyIds = newBounties.map((bounty) => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);
		const fullBounties = appState.utils.combineBounties(newBounties, issueData);
		return fullBounties;
	}

	async function getNewData(order, orderBy) {
		setIsLoading(true);
		setComplete(false);
		let newBounties = [];
		newBounties = await getBountyData(order, 0, orderBy);
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(order, orderBy) {
		setComplete(true);
		const newBounties = await getBountyData(
			order,
			pagination,
			orderBy,
			offChainCursor
		);
		if (newBounties.length !== 0) {
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));
	}

	return (
		<main className="bg-dark-mode flex-col">
			<div className="flex justify-center">
				<SubMenu
					styles={'justify-center'}
					names={['Organizations', 'Issues']}
					toggleFunc={setInternalMenu}
					toggleVal={internalMenu}
				/>
			</div>
			<div>
				{internalMenu == 'Organizations' ? (
					<OrganizationHomepage orgs={controlledOrgs} />
				) : (
					<BountyHomepage
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

export const getServerSideProps = async () => {
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	const utils = new Utils();
	githubRepository.instance.setGraphqlHeaders();
	let orgs = [];
	const batch = 10;
	let renderError = '';
	try {
		orgs = await openQSubgraphClient.instance.getOrganizations();
	} catch (error) {
		renderError = 'OpenQ is having trouble loading data.';
	}
	const ids = orgs.map((org) => org.id);
	let githubOrganizations = [];
	let orgMetadata = [];
	try{	
		orgMetadata = await openQPrismaClient.instance.getOrgsMetadata(ids);
	}

	catch(err){
		console.log( err);
	}
	try {
		githubOrganizations = await githubRepository.instance.fetchOrgsOrUsersByIds(
			ids
		);
		renderError = 'OpenQ is unable to connect with Github.';
	} catch (err) {
		console.log(err);
	}
	let mergedOrgs = orgs.map((org) => {
		let currentGithubOrg;
		let currentMetadatum={};
		for (const orgMetadatum of orgMetadata) {
			if (org.id === orgMetadatum.id) {
				currentMetadatum = orgMetadatum;
			}
		}
		for (const githubOrganization of githubOrganizations) {
			if (org.id === githubOrganization.id) {
				currentGithubOrg = githubOrganization;
			}
		}
		return { ...currentMetadatum, ...org, ...currentGithubOrg };
	}).filter((org)=>{
	
		return !org.blacklisted;
	});

	// Fetch Bounties

	// Fetch from Subgraph
	let newBounties = [];
	try {
		newBounties = await openQSubgraphClient.instance.getAllBounties(
			'desc',
			0,
			batch
		);
	} catch (err) {
		if (
			err.message.includes(
				'Wait for it to ingest a few blocks before querying it'
			)
		) {
			console.log('graph empty');
			return {
				props: {
					orgs: [],
					fullBounties: [],
				},
			};
		} else {
			console.log(err);
			renderError = 'OpenQ is unable to display bounties.';
		}
	}
	const bountyIds = newBounties.map((bounty) => bounty.bountyId);
	const bountyAddresses = newBounties.map((bounty)=>bounty.bountyAddress);
	
	let bountyMetadata = [];
	try{
		bountyMetadata = await openQPrismaClient.instance.getBlackListed(bountyAddresses);
	}
	catch(err){	
		console.log(err);}
		
	// Fetch from Github
	let issueData = [];
	try {
		issueData = await githubRepository.instance.getIssueData(bountyIds);
	} catch (err) {
		renderError = 'OpenQ is unable to connect with Github.';
	}
	const fullBounties = utils.combineBounties(newBounties, issueData, bountyMetadata);

	return {
		props: {
			orgs: mergedOrgs,
			fullBounties,
			newBounties,
			issueData,
			renderError,
			batch,
		},
	};
};
