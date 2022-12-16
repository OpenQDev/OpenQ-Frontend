// Third party
import React from 'react';
import ShowCasePage from '../../../components/ShowCase/ShowCasePage';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import nookies from 'nookies';

const showcasePR = ({ pr }) => {
  return <>{pr && <ShowCasePage pr={pr} />}</>;
};

export default showcasePR;

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();
  const cookies = nookies.get(context);
  const { github_oauth_token_unsigned } = cookies;
  const oauthToken = github_oauth_token_unsigned ? github_oauth_token_unsigned : null;
  githubRepository.instance.setGraphqlHeaders(oauthToken);

  const { id } = context.query;
  const pr = await githubRepository.instance.getPrById(id);

  return {
    props: {
      pr,
      oauthToken,
    },
  };
};
