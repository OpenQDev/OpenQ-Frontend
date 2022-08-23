// Third party
import React from 'react';
import { ethers } from 'ethers';

// Custom
import AboutFreelancer from '../../components/User/AboutFreelancer';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import useAuth from '../../hooks/useAuth';

const account = ({account, user, organizations, renderError,  starredOrganizations}) => {
	const [authState]=useAuth();
	const {signedAccount} = authState;
	return (

		<div className=' gap-4 justify-center pt-6'>{user ?
			<AboutFreelancer showWatched={account===signedAccount} starredOrganizations={starredOrganizations} user={user} account={account} organizations={organizations}/> 
			:	<UnexpectedError error={renderError} />}
		</div>
	);	
};

export const getServerSideProps = async(context)=>{
	let account = context.params.account;
	let renderError = '';

	try {
		let provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_PROJECT_ID);
	
		account = await provider.resolveName(account);
		// we need to check if their address is reverse registered 
			
	}
	catch(err){
		console.log('ens account not found');
	}
	try{
		ethers.utils.getAddress(account);
	}
	catch{
		return {props: {renderError: `${account} is not a valid address.`}};
	}
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	const githubRepository = new WrappedGithubClient();
	githubRepository.instance.setGraphqlHeaders();
	let user = {
		bountiesClosed:[],
		bountiesCreated: [],
		deposits: [],
		fundedTokenBalances: [],
		id: account.toLowerCase(),
		payoutTokenBalances: [],
		payouts: [],
		renderError
	};
	let organizations = [];
	let starredOrganizations=[];
	try{
		const	userOnChainData = await openQSubgraphClient.instance.getUser(account.toLowerCase());
		const userOffChainData = await openQPrismaClient.instance.getUser(ethers.utils.getAddress(account));
		
		//get starred organizations.
		try{
			if(userOffChainData){
				const subgraphOrgs =  await  openQSubgraphClient.instance.getOrganizationsByIds( userOffChainData.starredOrganizationIds);
				const githubOrgIds = subgraphOrgs.map(bounty=>bounty.id);
				const githubOrganizations = await githubRepository.instance.fetchOrgsOrUsersByIds(githubOrgIds);
				starredOrganizations = githubOrganizations.map((organization)=>{
					const subgraphOrg = subgraphOrgs.find((org)=>{
						return org.id === organization.id;
					});

					return {...organization, ...subgraphOrg, starred: true};
				});
			}
			else starredOrganizations=[];
		}
		catch(err){
			console.log(err);
		}

		// fetch orgs freelancer has worked for.
		try{
			const issueIds = userOnChainData.bountiesClosed.map(bounty => bounty.bountyId);		
			organizations = await githubRepository.instance.parseOrgIssues(issueIds);
		}
		catch(err){
			console.error('could not fetch organizations');
		}
		user = {...user, ...userOffChainData, ...userOnChainData};
	}
	catch(err){
		
		console.log(err);
	}
	
	
	return { props: {account, user,  organizations, renderError, starredOrganizations}};
};

export default account;
