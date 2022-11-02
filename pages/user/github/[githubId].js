// Third party
import React from 'react';
import { ethers } from 'ethers';

// Custom
import AboutFunder from '../../../components/User/AboutFunder';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
// import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
// import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../../services/logger/Logger';
import useWeb3 from '../../../hooks/useWeb3';
import useAuth from '../../../hooks/useAuth';

const account = ({ githubId, user, userData, organizations, renderError }) => {
  // TODO => useAuth => only user can see connection and connect to different wallet
  const { account } = useWeb3();
  const [authState] = useAuth();
  console.log(authState.githubId);
  return (
    <div className=' md:grid grid-cols-wide gap-4 justify-center col-start-2 pt-12'>
      {githubId ? (
        <section className='min-h-card rounded-lg shadow-sm col-start-2 md:border border-web-gray'>
          It works. Or does it? {account} {authState.githubId} {authState.login}
          {console.log(authState)}
        </section>
      ) : (
        <UnexpectedErrorModal error={renderError} />
      )}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const githubId = context.params.githubId;
  if (githubId == 'loading') {
    return { props: { githubId } };
  }

  const githubRepository = new WrappedGithubClient();
  githubRepository.instance.setGraphqlHeaders();
  const logger = new Logger();

  let renderError = '';
  let userData = {};
  try {
    userData = await githubRepository.instance.fetchUserById(githubId);
  } catch (err) {
    logger.error(err);
    return { props: { renderError: `${githubId} is not a valid GitHub ID.` } };
  }

  console.log('down here', githubId);

  return { props: { githubId, renderError, userData } };
};

export default account;
