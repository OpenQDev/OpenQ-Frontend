// Third party
import React from 'react';
import { ethers } from 'ethers';

// Custom
import AboutUser from '../../components/User/AboutUser';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import useAuth from '../../hooks/useAuth';

const account = ({account, user, organizations, renderError}) => {
	useAuth();
	return (

		<div className=' md:grid grid-cols-wide gap-4 justify-center col-start-2 pt-12'>{user ?
			<section className="min-h-card rounded-lg shadow-sm col-start-2 md:border border-web-gray">
				<AboutUser user={user} account={account} organizations={organizations}/> 
			</section>:
			<UnexpectedError error={renderError} />}
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
	try{
		const	userOnChainData = await openQSubgraphClient.instance.getUser(account.toLowerCase());
		const userOffChainData = await openQPrismaClient.instance.getUser(ethers.utils.getAddress(account));
	
		const issueIds = userOnChainData.bountiesClosed.map(bounty => bounty.bountyId);
		try{
			organizations = await githubRepository.instance.parseOrgIssues(issueIds);
		}
		catch(err){
			console.log(err);
		}
		user = {...user, ...userOffChainData, ...userOnChainData};
	}
	catch(err){
		
		console.log(err);
	}
	
	
	return { props: {account, user,  organizations, renderError}};
};

export default account;
