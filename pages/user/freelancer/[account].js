// Third party
import React from 'react';
import { ethers } from 'ethers';

// Custom
import AboutFreelancer from '../../../components/User/AboutFreelancer';
import UnexpectedError from '../../../components/Utils/UnexpectedError';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import useAuth from '../../../hooks/useAuth';

const account = ({account, user, organizations, renderError, watchedBounties, starredOrganizations}) => {
	useAuth();
	console.log(starredOrganizations);
	return (

		<div className=' gap-4 justify-center pt-12'>{user ?
			<AboutFreelancer starredOrganizations={starredOrganizations} watchedBounties={watchedBounties} user={user} account={account} organizations={organizations}/> 
			:	<UnexpectedError error={renderError} />}
		</div>
	);	
};

export const getServerSideProps = async(context)=>{
	
	const account = context.params.account;
	let renderError = '';
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
	let watchedBounties = [];
	let starredOrganizations=[];
	try{
		const	userOnChainData = await openQSubgraphClient.instance.getUser(account.toLowerCase());
		const userOffChainData = await openQPrismaClient.instance.getUser(ethers.utils.getAddress(account));
		console.log(userOffChainData);
		// fetch issues freelancer is watching.
		
		const watchedBountyIdsLowerCase = userOffChainData.watchedBountyIds.map(contract=>contract.toLowerCase());
		try{
			const subgraphBounties =  await  openQSubgraphClient.instance.getBountiesByContractAddresses( watchedBountyIdsLowerCase);
			const githubIds = subgraphBounties.map(bounty=>bounty.bountyId);
			const githubBounties = await githubRepository.instance.getIssueData(githubIds);
			watchedBounties = subgraphBounties.map((bounty, index)=>{return {...bounty, ...githubBounties[index]};});
		}
		catch(err){
			console.error('Could not fetch watched bounties.');
		}
		//get starred organizations.
		try{
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
		user = {...user, ...userOffChainData, ...userOnChainData, watchedBounties};
	}
	catch(err){
		
		console.log(err);
	}
	
	
	return { props: {account, user,  organizations, renderError, watchedBounties, starredOrganizations}};
};

export default account;
