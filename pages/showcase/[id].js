// Third party
import React from 'react';
import ShowCasePage from '../../components/ShowCase/ShowCasePage';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import useAuth from '../../hooks/useAuth';

const showcasePR = ({ pr }) => {
  useAuth();

  return <>{pr && <ShowCasePage pr={pr} />}</>;
};

export default showcasePR;

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();
  githubRepository.instance.setGraphqlHeaders();
  const { id } = context.query;
  githubRepository.instance.setGraphqlHeaders();
  const pr = await githubRepository.instance.getPrById(id);

  return {
    props: {
      pr,
    },
  };
};
