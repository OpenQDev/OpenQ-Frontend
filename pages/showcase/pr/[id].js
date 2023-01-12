// Third party
import React from 'react';
import ShowCasePage from '../../../components/ShowCase/ShowCasePage';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';

const showcasePR = ({ pr }) => {
  return <>{pr && <ShowCasePage pr={pr} />}</>;
};

export default showcasePR;

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();

  const { id } = context.query;
  const pr = await githubRepository.instance.getPrById(id);

  return {
    props: {
      pr,
    },
  };
};
