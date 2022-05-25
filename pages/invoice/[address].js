import React from 'react';


import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import Invoice from '../../components/Invoicing/Invoice';

const invoice = ({bounty})=>{

	return <Invoice bounty={bounty} />;
	
};

export const getServerSideProps =async(context)=>{
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubClient = new WrappedGithubClient();
	githubClient.instance.setGraphqlHeaders();
	const {id, address} = context.query;
	
	const issueData = await githubClient.instance.fetchIssueById(id);
	const bounty  = await openQSubgraphClient.instance.getBounty(address, 'no-cache');
	const mergedBounty = {...issueData, ...bounty};
	

	return {props: {id, address, issueData, bounty: mergedBounty}};
};

export default invoice;