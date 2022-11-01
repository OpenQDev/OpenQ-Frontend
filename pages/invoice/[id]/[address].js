import React from 'react';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import Invoice from '../../../components/Invoicing/Invoice';
import UnexpectedError from '../../../components/Utils/UnexpectedError';
import useAuth from '../../../hooks/useAuth';
import Logger from '../../../services/logger/Logger';

const invoice = ({ bounty, renderError }) => {
  useAuth();
  return <>{renderError ? <UnexpectedError error={renderError} /> : <Invoice bounty={bounty} />}</>;
};

export const getServerSideProps = async (context) => {
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const githubClient = new WrappedGithubClient();
  githubClient.instance.setGraphqlHeaders();
  const logger = new Logger();
  const { id, address } = context.query;
  let issueData = {};
  let renderError = '';
  try {
    issueData = await githubClient.instance.fetchIssueById(id);
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

  return { props: { bounty: mergedBounty, renderError } };
};

export default invoice;
