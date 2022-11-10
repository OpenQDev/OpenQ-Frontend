import React from 'react';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import Invoice from '../../../components/Invoicing/Invoice';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import useAuth from '../../../hooks/useAuth';
import Logger from '../../../services/logger/Logger';
import nookies from 'nookies';

const invoice = ({ bounty, renderError }) => {
	useAuth();
	return <>{renderError ? <UnexpectedErrorModal error={renderError} /> : <Invoice bounty={bounty} />}</>;
};

export const getServerSideProps = async (context) => {
	const githubRepository = new WrappedGithubClient();
	const cookies = nookies.get(context);
	const { github_oauth_token_unsigned } = cookies;
	const oauthToken = github_oauth_token_unsigned ? github_oauth_token_unsigned : null;
	githubRepository.instance.setGraphqlHeaders(oauthToken);

	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const logger = new Logger();
	const { id, address } = context.query;
	let issueData = {};
	let renderError = '';
	try {
		issueData = await githubRepository.instance.fetchIssueById(id);
	} catch (err) {
		logger.error(err);
		renderError = 'OpenQ could not find the issue connected to this bounty on Github.';
	}
	let bounty = {};
	try {
		bounty = await openQSubgraphClient.instance.getBounty(address, 'no-cache');
		if (!bounty) {
			renderError = `OpenQ could not find a contract with this address: ${address}.`;
		}
	} catch (err) {
		renderError = `OpenQ could not find a contract with address: ${address}.`;
		logger.error(err);
	}
	const mergedBounty = { ...issueData, ...bounty };

	return { props: { bounty: mergedBounty, renderError, oauthToken } };
};

export default invoice;
