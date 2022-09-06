// Third party
import React from 'react';
import ShowCasePage from '../../../components/ShowCase/ShowCasePage';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import useAuth from '../../../hooks/useAuth';

const showcasePR = ({ bounty, pr }) => {
  useAuth();

  return <>{pr && bounty && <ShowCasePage bounty={bounty} pr={pr} />}</>;
};

export default showcasePR;

export const getServerSideProps = async (context) => {
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const githubRepository = new WrappedGithubClient();
  githubRepository.instance.setGraphqlHeaders();
  const { id, address } = context.query;
  githubRepository.instance.setGraphqlHeaders();
  const pr = await githubRepository.instance.getPrById(id);
  const bounty = await openQSubgraphClient.instance.getBounty(address);

  return {
    props: {
      bounty,
      pr,
    },
  };
};
