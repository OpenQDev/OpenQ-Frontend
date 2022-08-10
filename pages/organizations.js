// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import useAuth from '../hooks/useAuth';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';



export default function Index({ orgs }) {
	useAuth();
	const [controlledOrgs, setControlledOrgs] = useState(orgs);
	// State
	// Context
	const [appState] = useContext(StoreContext);
	const {reloadNow} = appState;






	useEffect(async()=>{
		if(reloadNow){
			const [mergedOrgs] = await appState.utils.fetchOrganizations(appState);

			console.log(mergedOrgs);
			setControlledOrgs(mergedOrgs);

		}
	},[reloadNow]);
	// Hooks



	return (
		<main className="bg-dark-mode flex-col">
			<OrganizationHomepage orgs={controlledOrgs} />
				
		</main>
	);
}

export const getServerSideProps = async (ctx) => {
	let type =['1', '2','3'];

	switch(ctx?.query?.type){
	case 'atomic-contracts':
		type=['3'];
		break;
	case 'contests':
		type=['2'];
		break;
	case 'repeatable':
		type=['1'];
		break;


	}

	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	const utils = new Utils();
	githubRepository.instance.setGraphqlHeaders();
	
	const [mergedOrgs, renderError] =await utils.fetchOrganizations({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance});

	return {
		props: {
			orgs: mergedOrgs,
			renderError,
			type
		},
	};
};
