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
import UnexpectedError from '../components/Utils/UnexpectedError';


export default function Index({ orgs, renderError }) {
	useAuth();
	const [controlledOrgs, setControlledOrgs] = useState(orgs);
	// State
	// Context
	const [appState] = useContext(StoreContext);
	const {reloadNow} = appState;
	console.log('renderError:',renderError);





	useEffect(async()=>{
		console.log(renderError);
		if(reloadNow){
			const [mergedOrgs] = await appState.utils.fetchOrganizations(appState);

			console.log(mergedOrgs);
			setControlledOrgs(mergedOrgs);

		}
	},[reloadNow]);
	// Hooks



	return (
		<main className="bg-dark-mode flex-col">
			{renderError?
				<UnexpectedError error={renderError} />:
				<OrganizationHomepage types={['0', '1', '2']} orgs={controlledOrgs} />}
				
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
	
	const [mergedOrgs, renderError] =await utils.fetchOrganizations({openQSubgraphClient: openQSubgraphClient.instance, githubRepository: githubRepository.instance, openQPrismaClient: openQPrismaClient.instance});

	return {
		props: {
			orgs: mergedOrgs,
			renderError,
			types
		},
	};
};
