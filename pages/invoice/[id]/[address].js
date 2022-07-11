import React from 'react';


import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import Invoice from '../../../components/Invoicing/Invoice';
import UnexpectedError from '../../../components/Utils/UnexpectedError';
import useAuth from '../../../hooks/useAuth';

const invoice = ({bounty, renderError})=>{
	useAuth();
	return <>
		{renderError? 
			<UnexpectedError error={renderError}/>:
			<Invoice bounty={bounty} />}
	</>;
	
};

export const getServerSideProps =async(context)=>{
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubClient = new WrappedGithubClient();
	githubClient.instance.setGraphqlHeaders();
	const {id, address} = context.query;
	let issueData = {};
	let renderError = '';
	try{
		issueData = await githubClient.instance.fetchIssueById(id);
	}
	catch(err){
		console.log(err);
		renderError ='OpenQ could not find the issue connected to this bounty on Github.';
	}
	let bounty = {};
	try{
		bounty  = await openQSubgraphClient.instance.getBounty(address, 'no-cache');
		if(!bounty){
			renderError =`OpenQ could not find a bounty this with this address: ${address}.`;
		}
	}
	catch(err){
		renderError =`OpenQ could not find a bounty with address: ${address}.`;
		console.log(err);
	}
	const mergedBounty = {...issueData, ...bounty};
	

	return {props: { bounty: mergedBounty, renderError}};
};

export default invoice;