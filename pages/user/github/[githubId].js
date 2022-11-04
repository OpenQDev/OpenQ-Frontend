// Third party
import React from 'react';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import AssociationModal from '../../../components/User/GithubRegistration/AssociationModal';
import Logger from '../../../services/logger/Logger';

const account = ({ githubId, user /* , organizations */, renderError }) => {
  return <AssociationModal githubId={githubId} user={user} renderError={renderError} />;
};

export const getServerSideProps = async (context) => {
  const githubId = context.params.githubId;
  const githubRepository = new WrappedGithubClient();
  githubRepository.instance.setGraphqlHeaders();
  const logger = new Logger();
  let renderError = '';
  let user = {};
  try {
    user = await githubRepository.instance.fetchUserById(githubId);
  } catch (err) {
    logger.error(err);
    return { props: { renderError: `${githubId} is not a valid GitHub ID.` } };
  }
  return { props: { githubId, renderError, user } };
};

export default account;
